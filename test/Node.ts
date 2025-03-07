const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RootNode and ChildNode", function () {
    let rootNode: { address: any; addChild: (arg0: any) => any; findNode: (arg0: any) => any; }, childNode1: { address: any; addChild: (arg0: any) => any; }, childNode2: { address: any; }, addr1, addr2;

    beforeEach(async function () {
        [addr1, addr2] = await ethers.getSigners();
        console.log("addr1", addr1.address);
        console.log("addr2", addr2.address);
        // Deploy RootNode
        const RootNode = await ethers.getContractFactory("RootNode");
        rootNode = await RootNode.deploy("Root Attribute 1", "Root Attribute 2");
        await rootNode.deployed();
        console.log("rootNode.attr1", rootNode.attr1);
        console.log("rootNode.attr2", rootNode.attr2);
        console.log("rootNode", rootNode);


        // Deploy ChildNodes
        const ChildNode = await ethers.getContractFactory("ChildNode");
        childNode1 = await ChildNode.deploy(rootNode.address, ["Child 1 Attr"]);
        childNode2 = await ChildNode.deploy(rootNode.address, ["Child 2 Attr"]);
        console.log(childNode1.address);
        console.log(childNode2.address);
        // Add ChildNodes to RootNode
        await rootNode.addChild(childNode1.address);
        await rootNode.addChild(childNode2.address);
        console.log(rootNode.childCount);
    });

    it("should find a direct child node", async function () {
        const found = await rootNode.findNode(childNode1.address);
        expect(found).to.be.true;
    });

    it("should find a child node through another child", async function () {
        const found = await rootNode.findNode(childNode2.address);
        expect(found).to.be.true;
    });

    it("should not find a non-existing node", async function () {
        const fakeAddress = ethers.constants.AddressZero;
        const found = await rootNode.findNode(fakeAddress);
        expect(found).to.be.false;
    });

    //   it("should find a child node from a deeper level", async function () {
    //     // Deploy grandchild
    //     const grandChildNode = await ChildNode.deploy(childNode1.address, ["Grandchild Attr"]);
    //     await childNode1.addChild(grandChildNode.address);

    //     const found = await rootNode.findNode(grandChildNode.address);
    //     expect(found).to.be.true;
    //   });
});
