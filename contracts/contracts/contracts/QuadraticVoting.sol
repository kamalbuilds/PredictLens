// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IPostAction} from "../interfaces/IPostAction.sol";
import {Types} from "../interfaces/Types.sol";
import {UNIVERSAL_ACTION_MAGIC_VALUE} from "../interfaces/Constants.sol";

/**
 * @title QuadraticVoting
 * @notice A contract implementing quadratic voting for prediction market resolution
 * @dev This contract provides a fair voting mechanism for market resolution in Lens v3
 */
contract QuadraticVoting is IPostAction {
    // Action Hub contract reference
    address public immutable ACTION_HUB;
    
    // Vote state for a specific market
    struct VotingState {
        uint256 startTime;
        uint256 endTime;
        bool finalized;
        uint8 winningOption;
        uint256 totalVotesOption0;
        uint256 totalVotesOption1;
        mapping(address => mapping(uint8 => uint256)) userVotes;
        mapping(address => uint256) userTotalCost;
    }

    // Voting states by feed and post ID
    mapping(address => mapping(uint256 => VotingState)) private votingStates;
    
    // Events
    event VotingStarted(address indexed feed, uint256 indexed postId, uint256 startTime, uint256 endTime);
    event VoteCast(address indexed feed, uint256 indexed postId, address voter, uint8 option, uint256 voteAmount, uint256 voteCost);
    event VotingFinalized(address indexed feed, uint256 indexed postId, uint8 winningOption);
    
    /**
     * @notice Initialize the contract with the Lens Action Hub address
     * @param actionHub The address of the Lens Action Hub contract
     */
    constructor(address actionHub) {
        ACTION_HUB = actionHub;
    }

    /**
     * @notice Verify that only the Action Hub can call certain functions
     */
    modifier onlyActionHub() {
        require(msg.sender == ACTION_HUB, "Only Action Hub can call");
        _;
    }
    
    /**
     * @notice Configure a voting instance for a post
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
        
        // Parse duration parameter
        uint256 duration = 24 hours; // Default duration
        
        for (uint256 i = 0; i < params.length; i++) {
            if (keccak256(bytes(params[i].key)) == keccak256(bytes("duration"))) {
                duration = abi.decode(params[i].value, (uint256));
            }
        }
        
        // Validate the voting initialization
        require(duration >= 1 hours && duration <= 7 days, "Invalid duration");
        
        VotingState storage state = votingStates[feed][postId];
        require(state.startTime == 0, "Voting already started");
        
        // Set voting period
        state.startTime = block.timestamp;
        state.endTime = block.timestamp + duration;
        
        emit VotingStarted(feed, postId, state.startTime, state.endTime);
        
        return abi.encode(true);
    }
    
    /**
     * @notice Helper function to parse vote parameters
     * @param params Key-value parameters for the action
     * @return option The vote option selected
     * @return voteAmount The number of votes to cast
     */
    function _parseVoteParams(Types.KeyValue[] calldata params) 
        private pure returns (uint8 option, uint256 voteAmount) 
    {
        for (uint256 i = 0; i < params.length; i++) {
            if (keccak256(bytes(params[i].key)) == keccak256(bytes("option"))) {
                option = uint8(abi.decode(params[i].value, (uint256)));
            } else if (keccak256(bytes(params[i].key)) == keccak256(bytes("voteAmount"))) {
                voteAmount = abi.decode(params[i].value, (uint256));
            }
        }
        return (option, voteAmount);
    }
    
    /**
     * @notice Execute a vote action
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
        // Parse vote parameters
        (uint8 option, uint256 voteAmount) = _parseVoteParams(params);
        
        VotingState storage state = votingStates[feed][postId];
        
        // Validate the vote
        require(state.startTime > 0, "Voting not started");
        require(block.timestamp < state.endTime, "Voting ended");
        require(!state.finalized, "Voting finalized");
        require(option <= 1, "Invalid option");
        require(voteAmount > 0, "Amount must be greater than 0");
        
        // Update the vote counts
        _processVote(state, originalMsgSender, feed, postId, option, voteAmount);
        
        return abi.encode(true);
    }
    
    /**
     * @notice Process a vote by updating state
     * @param state The voting state to update
     * @param voter The address of the voter
     * @param feed The feed contract address
     * @param postId The post ID
     * @param option The vote option selected
     * @param voteAmount The number of votes to cast
     */
    function _processVote(
        VotingState storage state,
        address voter,
        address feed,
        uint256 postId,
        uint8 option,
        uint256 voteAmount
    ) private {
        // Calculate the cost of the votes (quadratic cost)
        uint256 currentVotes = state.userVotes[voter][option];
        uint256 newTotalVotes = currentVotes + voteAmount;
        
        // Calculate the additional cost
        uint256 newTotalCost = newTotalVotes * newTotalVotes;
        uint256 currentCost = currentVotes * currentVotes;
        uint256 additionalCost = newTotalCost - currentCost;
        
        // Update state
        state.userVotes[voter][option] += voteAmount;
        state.userTotalCost[voter] += additionalCost;
        
        // Update vote totals
        if (option == 0) {
            state.totalVotesOption0 += voteAmount;
        } else {
            state.totalVotesOption1 += voteAmount;
        }
        
        emit VoteCast(feed, postId, voter, option, voteAmount, additionalCost);
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
     * @notice Finalize the voting and determine the winning option
     * @param feed The feed contract address
     * @param postId The post ID
     */
    function finalizeVoting(address feed, uint256 postId) external {
        VotingState storage state = votingStates[feed][postId];
        
        // Validate finalization
        require(state.startTime > 0, "Voting not started");
        require(block.timestamp >= state.endTime, "Voting not ended");
        require(!state.finalized, "Already finalized");
        
        // Determine the winning option
        state.finalized = true;
        
        if (state.totalVotesOption0 > state.totalVotesOption1) {
            state.winningOption = 0;
        } else {
            state.winningOption = 1;
        }
        
        emit VotingFinalized(feed, postId, state.winningOption);
    }
    
    /**
     * @notice Get information about a voting state
     * @param feed The feed contract address
     * @param postId The post ID
     */
    function getVotingInfo(address feed, uint256 postId) external view returns (
        uint256 startTime,
        uint256 endTime,
        bool finalized,
        uint8 winningOption,
        uint256 totalVotesOption0,
        uint256 totalVotesOption1
    ) {
        VotingState storage state = votingStates[feed][postId];
        
        return (
            state.startTime,
            state.endTime,
            state.finalized,
            state.winningOption,
            state.totalVotesOption0,
            state.totalVotesOption1
        );
    }
    
    /**
     * @notice Get a user's votes for a specific option
     * @param feed The feed contract address
     * @param postId The post ID
     * @param user The user address
     * @param option The option to check
     */
    function getUserVotes(address feed, uint256 postId, address user, uint8 option) external view returns (uint256) {
        return votingStates[feed][postId].userVotes[user][option];
    }
    
    /**
     * @notice Get a user's total voting cost
     * @param feed The feed contract address
     * @param postId The post ID
     * @param user The user address
     */
    function getUserTotalCost(address feed, uint256 postId, address user) external view returns (uint256) {
        return votingStates[feed][postId].userTotalCost[user];
    }
} 