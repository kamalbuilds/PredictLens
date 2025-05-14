// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Types} from "./Types.sol";

/**
 * @title IPostAction
 * @notice Interface for Post Actions in Lens Protocol v3
 */
interface IPostAction {
    /**
     * @notice Configures a post action with the given data
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
    ) external returns (bytes memory);

    /**
     * @notice Executes a post action with the given data
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
    ) external returns (bytes memory);

    /**
     * @notice Handles enabling/disabling of a post action
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
    ) external returns (bytes memory);
} 