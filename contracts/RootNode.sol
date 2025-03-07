// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IChildNode.sol";
import "./ChildNode.sol";

contract RootNode {
    struct Node {
        address contractAddress;
        bool exists;
    }

    mapping(uint256 => Node) public children;
    uint256 public childCount;

    string public attr1;
    string public attr2;

    constructor(string memory _attr1, string memory _attr2) {
        attr1 = _attr1;
        attr2 = _attr2;
    }

    function addChild(address childContract) public {
        children[childCount] = Node(childContract, true);
        childCount++;
    }

    function getChild(uint256 index) public view returns (address) {
        require(children[index].exists, "Child does not exist");
        return children[index].contractAddress;
    }

    function findNode(address target) public view returns (bool) {
        // Controlla se il nodo è uno dei figli diretti
        for (uint256 i = 0; i < childCount; i++) {
            if (children[i].contractAddress == target) {
                return true; // Nodo trovato nel primo livello
            }
            // Se il figlio è un altro nodo, prosegui la ricerca ricorsivamente
            if (ChildNode(children[i].contractAddress).findNode(target)) {
                return true;
            }
        }
        return false; // Nodo non trovato
    }
}
