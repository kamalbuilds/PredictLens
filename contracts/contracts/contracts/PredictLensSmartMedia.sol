// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IPostAction} from "../interfaces/IPostAction.sol";
import {Types} from "../interfaces/Types.sol";
import {UNIVERSAL_ACTION_MAGIC_VALUE} from "../interfaces/Constants.sol";

/**
 * @title PredictLensSmartMedia
 * @notice A contract for handling dynamic Smart Media content in prediction markets
 * @dev This contract implements the IPostAction interface to be used as a Lens Open Action
 */
contract PredictLensSmartMedia is IPostAction {
    // Action Hub contract reference
    address public immutable ACTION_HUB;
    
    // Template state for a specific market
    struct Template {
        string templateType;
        string templateData;
        address creator;
        bool isActive;
        uint256 usageCount;
        mapping(address => bool) userHasUsed;
    }

    // Templates by feed and post ID
    mapping(address => mapping(uint256 => Template)) private templates;
    
    // Events
    event TemplateCreated(address indexed feed, uint256 indexed postId, string templateType, string templateData);
    event TemplateUsed(address indexed feed, uint256 indexed postId, address user);
    
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
     * @notice Initialize a new template when a post action is configured
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
        string memory templateType;
        string memory templateData;
        
        for (uint256 i = 0; i < params.length; i++) {
            if (keccak256(bytes(params[i].key)) == keccak256(bytes("templateType"))) {
                templateType = string(params[i].value);
            } else if (keccak256(bytes(params[i].key)) == keccak256(bytes("templateData"))) {
                templateData = string(params[i].value);
            }
        }
        
        // Validate the template parameters
        require(bytes(templateType).length > 0, "Template type cannot be empty");
        require(bytes(templateData).length > 0, "Template data cannot be empty");
        
        // Store the template data
        Template storage template = templates[feed][postId];
        template.templateType = templateType;
        template.templateData = templateData;
        template.creator = originalMsgSender;
        template.isActive = true;
        
        emit TemplateCreated(feed, postId, templateType, templateData);
        
        return abi.encode(true);
    }
    
    /**
     * @notice Process a user action on a post (use template)
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
        Template storage template = templates[feed][postId];
        
        // Validate the template and usage
        require(template.isActive, "Template not active");
        require(!template.userHasUsed[originalMsgSender], "Already used template");
        
        // Update template state
        template.userHasUsed[originalMsgSender] = true;
        template.usageCount++;
        
        emit TemplateUsed(feed, postId, originalMsgSender);
        
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
        Template storage template = templates[feed][postId];
        
        // Only the creator can enable/disable the template
        require(originalMsgSender == template.creator, "Not template creator");
        
        // Update template state
        template.isActive = !isDisabled;
        
        return abi.encode(true);
    }
    
    /**
     * @notice Get information about a template
     * @param feed The feed contract address
     * @param postId The post ID
     */
    function getTemplateInfo(address feed, uint256 postId) external view returns (
        string memory templateType,
        string memory templateData,
        address creator,
        bool isActive,
        uint256 usageCount
    ) {
        Template storage template = templates[feed][postId];
        
        return (
            template.templateType,
            template.templateData,
            template.creator,
            template.isActive,
            template.usageCount
        );
    }
    
    /**
     * @notice Check if a user has used a template
     * @param feed The feed contract address
     * @param postId The post ID
     * @param user The user address
     */
    function hasUsedTemplate(address feed, uint256 postId, address user) external view returns (bool) {
        return templates[feed][postId].userHasUsed[user];
    }
    
    /**
     * @notice Update a template's data (only creator can call)
     * @param feed The feed contract address
     * @param postId The post ID
     * @param newTemplateData The new template data
     */
    function updateTemplateData(address feed, uint256 postId, string calldata newTemplateData) external {
        Template storage template = templates[feed][postId];
        
        // Only the creator can update the template
        require(msg.sender == template.creator, "Not template creator");
        require(template.isActive, "Template not active");
        
        // Update template data
        template.templateData = newTemplateData;
    }
} 