// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockActionHub
 * @notice A mock implementation of the Lens Protocol Action Hub for testing purposes
 */
contract MockActionHub {
    /**
     * @notice Event emitted when an action is executed
     */
    event ActionExecuted(address caller, address target, bytes data);
    
    /**
     * @notice Simple function to simulate Action Hub functionality
     * @param target The target contract to interact with
     * @param data The calldata to forward
     */
    function executeAction(address target, bytes calldata data) external returns (bytes memory) {
        (bool success, bytes memory returnData) = target.call(data);
        require(success, "MockActionHub: Action execution failed");
        
        emit ActionExecuted(msg.sender, target, data);
        
        return returnData;
    }
} 