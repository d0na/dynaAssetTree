import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

describe("RootNode and ChildNode", function () {
    async function deployFixture() {
        const [addr1, addr2] = await ethers.getSigners();
        
        // Deploy RootNode
        const RootNode = await ethers.getContractFactory("RootNode");
        const rootNode = await RootNode.deploy("Root Attribute 1", "Root Attribute 2");
        await rootNode.waitForDeployment();
        console.log("Created rootNode", rootNode.target);

        // Deploy ChildNodes
        const ChildNode = await ethers.getContractFactory("ChildNode");
        const childNode1 = await ChildNode.deploy(rootNode, ["Child 1 Attr"]);
        await childNode1.waitForDeployment();
        const childNode2 = await ChildNode.deploy(rootNode, ["Child 2 Attr"]);
        await childNode2.waitForDeployment();

        console.log("Created childNode1", childNode1.target);
        console.log("Created childNode2", childNode2.target);

        // Add ChildNodes to RootNode
        await rootNode.addChild(childNode1);
        await rootNode.addChild(childNode2);
        console.log("count", await rootNode.childCount());

        return { rootNode, childNode1, childNode2, addr1, addr2 };
    }

    it("should find a direct child node", async function () {
        const { rootNode, childNode1 } = await loadFixture(deployFixture);
        const found = await rootNode.findNode(childNode1);
        expect(found).to.be.true;
    });

    it("should find a child node through another child", async function () {
        const { rootNode, childNode2 } = await loadFixture(deployFixture);
        const found = await rootNode.findNode(childNode2);
        expect(found).to.be.true;
    });

    it("should not find a non-existing node", async function () {
        const { rootNode } = await loadFixture(deployFixture);
        const fakeAddress = ethers.ZeroAddress;
        const found = await rootNode.findNode(fakeAddress);
        expect(found).to.be.false;
    });
});
