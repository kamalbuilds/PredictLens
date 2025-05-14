// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IPublicationActionModule
 * @notice Interface for Publication Action Modules in Lens Protocol
 */
interface IPublicationActionModule {
    /**
     * @notice Initializes a publication action with the given data
     * @param profileId The profile ID of the publication creator
     * @param pubId The publication ID
     * @param transactionExecutor The address of the transaction executor
     * @param data Action-specific initialization data
     */
    function initializePublicationAction(
        uint256 profileId,
        uint256 pubId,
        address transactionExecutor,
        bytes calldata data
    ) external returns (bytes memory);

    /**
     * @notice Processes a publication action with the given data
     * @param profileId The profile ID of the publication
     * @param pubId The publication ID
     * @param executor The address executing the action
     * @param transactionExecutor The address of the transaction executor
     * @param data Action-specific data
     */
    function processPublicationAction(
        uint256 profileId,
        uint256 pubId,
        address executor,
        address transactionExecutor,
        bytes calldata data
    ) external returns (bytes memory);
} 