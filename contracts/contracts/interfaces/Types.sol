// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Types
 * @notice Common types used across Lens Protocol v3
 */
library Types {
    /**
     * @notice Key-value struct for action parameters
     */
    struct KeyValue {
        string key;
        bytes value;
    }
} 