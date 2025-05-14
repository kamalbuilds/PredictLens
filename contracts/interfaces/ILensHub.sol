// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ILensHub
 * @notice Interface for the Lens Hub contract
 */
interface ILensHub {
    /**
     * @notice Returns the owner of the specified profile ID
     * @param profileId The profile ID to query
     * @return The address of the profile owner
     */
    function ownerOf(uint256 profileId) external view returns (address);
} 