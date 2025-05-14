// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IPostAction} from "../interfaces/IPostAction.sol";
import {Types} from "../interfaces/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {UNIVERSAL_ACTION_MAGIC_VALUE} from "../interfaces/Constants.sol";

/**
 * @title PredictionMarket
 * @notice A prediction market contract that integrates with Lens Protocol v3
 * @dev This contract implements the IPostAction interface to be used as a Lens Open Action
 */
contract PredictionMarket is IPostAction {
    using SafeERC20 for IERC20;

    // Action Hub contract reference
    address public immutable ACTION_HUB;
    
    // Market state
    struct Market {
        string question;
        uint256 endTime;
        uint256 resolveTime;
        address creator;
        bool resolved;
        uint8 winningOption;
        uint256 totalStaked;
        mapping(uint8 => uint256) optionTotals;
        mapping(address => mapping(uint8 => uint256)) userStakes;
    }

    // Market data by feed and post ID
    mapping(address => mapping(uint256 => Market)) private markets;
    
    // Token used for staking in the markets
    IERC20 public immutable stakingToken;
    
    // Fee percentage (in basis points) that goes to market creators
    uint16 public creatorFeeBps = 250; // 2.5%
    
    // Events
    event MarketCreated(address indexed feed, uint256 indexed postId, string question, uint256 endTime, uint256 resolveTime);
    event MarketStaked(address indexed feed, uint256 indexed postId, address user, uint8 option, uint256 amount);
    event MarketResolved(address indexed feed, uint256 indexed postId, uint8 winningOption);
    event MarketClaimed(address indexed feed, uint256 indexed postId, address user, uint256 reward);

    /**
     * @notice Initialize the contract with the Action Hub and staking token addresses
     * @param actionHub The address of the Lens Action Hub contract
     * @param _stakingToken The address of the token used for staking
     */
    constructor(address actionHub, address _stakingToken) {
        ACTION_HUB = actionHub;
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @notice Verify that only the Action Hub can call certain functions
     */
    modifier onlyActionHub() {
        require(msg.sender == ACTION_HUB, "Only Action Hub can call");
        _;
    }

    /**
     * @notice Initialize a new prediction market when a post action is configured
     * @param originalMsgSender The address that initiated the action
     * @param feed The feed contract address
     * @param postId The post ID
     * @param params Key-value parameters for the action
     */
    function configure(
        address originalMsgSender,
        address feed,
        uint256 postId,
        Types.KeyValue[] calldata params
    ) external override onlyActionHub returns (bytes memory) {
        // Support universal action configuration
        if (originalMsgSender == address(0) && feed == address(0) && postId == 0) {
            return abi.encode(UNIVERSAL_ACTION_MAGIC_VALUE);
        }
        
        // Parse initialization parameters
        string memory question;
        uint256 endTime;
        uint256 resolveTime;
        
        for (uint256 i = 0; i < params.length; i++) {
            if (keccak256(bytes(params[i].key)) == keccak256(bytes("question"))) {
                question = string(params[i].value);
            } else if (keccak256(bytes(params[i].key)) == keccak256(bytes("endTime"))) {
                endTime = abi.decode(params[i].value, (uint256));
            } else if (keccak256(bytes(params[i].key)) == keccak256(bytes("resolveTime"))) {
                resolveTime = abi.decode(params[i].value, (uint256));
            }
        }
        
        // Validate the market parameters
        require(bytes(question).length > 0, "Question cannot be empty");
        require(endTime > block.timestamp, "End time must be in the future");
        require(resolveTime > endTime, "Resolve time must be after end time");
        
        // Store the market data
        Market storage market = markets[feed][postId];
        market.question = question;
        market.endTime = endTime;
        market.resolveTime = resolveTime;
        market.creator = originalMsgSender;
        
        emit MarketCreated(feed, postId, question, endTime, resolveTime);
        
        return abi.encode(true);
    }

    /**
     * @notice Process a user action on a post (stake in market)
     * @param originalMsgSender The address that initiated the action
     * @param feed The feed contract address
     * @param postId The post ID
     * @param params Key-value parameters for the action
     */
    function execute(
        address originalMsgSender,
        address feed,
        uint256 postId,
        Types.KeyValue[] calldata params
    ) external override onlyActionHub returns (bytes memory) {
        // Parse action parameters
        uint8 option;
        uint256 amount;
        
        for (uint256 i = 0; i < params.length; i++) {
            if (keccak256(bytes(params[i].key)) == keccak256(bytes("option"))) {
                option = uint8(abi.decode(params[i].value, (uint256)));
            } else if (keccak256(bytes(params[i].key)) == keccak256(bytes("amount"))) {
                amount = abi.decode(params[i].value, (uint256));
            }
        }
        
        // Get the market data
        Market storage market = markets[feed][postId];
        
        // Validate the market and stake
        require(market.endTime > block.timestamp, "Market closed for staking");
        require(!market.resolved, "Market already resolved");
        require(option <= 1, "Invalid option");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from the user to this contract
        stakingToken.safeTransferFrom(originalMsgSender, address(this), amount);
        
        // Update market state
        market.userStakes[originalMsgSender][option] += amount;
        market.optionTotals[option] += amount;
        market.totalStaked += amount;
        
        emit MarketStaked(feed, postId, originalMsgSender, option, amount);
        
        return abi.encode(true);
    }

    /**
     * @notice Handle enabling/disabling the action
     * @param originalMsgSender The address that initiated the action
     * @param feed The feed contract address
     * @param postId The post ID
     * @param isDisabled Whether the action is being disabled or enabled
     * @param params Key-value parameters for the action
     */
    function setDisabled(
        address originalMsgSender,
        address feed,
        uint256 postId,
        bool isDisabled,
        Types.KeyValue[] calldata params
    ) external override onlyActionHub returns (bytes memory) {
        // This function is required by the interface but we don't
        // need special handling for enabling/disabling the action
        return abi.encode(true);
    }

    /**
     * @notice Resolve a prediction market
     * @param feed The feed contract address
     * @param postId The post ID
     * @param winningOption The winning option (0 or 1)
     */
    function resolveMarket(address feed, uint256 postId, uint8 winningOption) external {
        Market storage market = markets[feed][postId];
        
        // Validate the resolution
        require(block.timestamp >= market.endTime, "Market not ended yet");
        require(!market.resolved, "Already resolved");
        require(winningOption <= 1, "Invalid option");
        
        // For this example, only the creator can resolve the market
        // In a real implementation, this would use an oracle or quadratic voting mechanism
        require(msg.sender == market.creator, "Only creator can resolve");
        
        // Update market state
        market.resolved = true;
        market.winningOption = winningOption;
        
        emit MarketResolved(feed, postId, winningOption);
    }

    /**
     * @notice Claim rewards from a resolved market
     * @param feed The feed contract address
     * @param postId The post ID
     */
    function claimRewards(address feed, uint256 postId) external {
        Market storage market = markets[feed][postId];
        
        // Validate the claim
        require(market.resolved, "Market not resolved");
        
        uint8 winningOption = market.winningOption;
        uint256 userStake = market.userStakes[msg.sender][winningOption];
        
        // Check if user has any stake in the winning option
        require(userStake > 0, "No winning stake");
        
        // Calculate reward amount
        uint256 winningPool = market.optionTotals[winningOption];
        uint256 fee = (market.totalStaked * creatorFeeBps) / 10000;
        uint256 rewardPool = market.totalStaked - fee;
        
        uint256 reward = (userStake * rewardPool) / winningPool;
        
        // Reset user stake to prevent double claims
        market.userStakes[msg.sender][winningOption] = 0;
        
        // Transfer the fee to the creator
        if (fee > 0) {
            stakingToken.safeTransfer(market.creator, fee);
        }
        
        // Transfer the reward to the user
        stakingToken.safeTransfer(msg.sender, reward);
        
        emit MarketClaimed(feed, postId, msg.sender, reward);
    }

    /**
     * @notice Get information about a market
     * @param feed The feed contract address
     * @param postId The post ID
     */
    function getMarketInfo(address feed, uint256 postId) external view returns (
        string memory question,
        uint256 endTime,
        uint256 resolveTime,
        address creator,
        bool resolved,
        uint8 winningOption,
        uint256 totalStaked,
        uint256 option0Total,
        uint256 option1Total
    ) {
        Market storage market = markets[feed][postId];
        
        return (
            market.question,
            market.endTime,
            market.resolveTime,
            market.creator,
            market.resolved,
            market.winningOption,
            market.totalStaked,
            market.optionTotals[0],
            market.optionTotals[1]
        );
    }

    /**
     * @notice Get a user's stake in a specific market option
     * @param feed The feed contract address
     * @param postId The post ID
     * @param user The user address
     * @param option The option to check
     */
    function getUserStake(address feed, uint256 postId, address user, uint8 option) external view returns (uint256) {
        return markets[feed][postId].userStakes[user][option];
    }
} 