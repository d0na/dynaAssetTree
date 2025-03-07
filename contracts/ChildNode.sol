// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IChildNode.sol";

contract ChildNode is IChildNode {
    address public parent;
    string[] public attributes;
    address[] public children;

    constructor(address _parent, string[] memory _attributes) {
        parent = _parent;
        attributes = _attributes;
    }

    function addChild(address childContract) public {
        children.push(childContract);
    }

    function getAttributes() public view override returns (string[] memory) {
        return attributes;
    }

    function getChildren() public view override returns (address[] memory) {
        return children;
    }

    function getParent() public view override returns (address) {
        return parent;
    }

    function findNode(address target) public view  returns (bool) {
        if (address(this) == target) {
            return true; // Nodo trovato
        }

        // Cerca nei figli
        for (uint256 i = 0; i < children.length; i++) {
            if (ChildNode(children[i]).findNode(target)) {
                return true;
            }
        }

        return false; // Nodo non trovato
    }
}
