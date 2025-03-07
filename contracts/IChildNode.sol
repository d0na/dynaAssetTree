// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChildNode {
    function getAttributes() external view returns (string[] memory);
    function getChildren() external view returns (address[] memory);
    function getParent() external view returns (address);
}
