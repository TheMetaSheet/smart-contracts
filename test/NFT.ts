import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("TheMetaSheet", function () {
  it("NFT init", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    expect(await nft.excelLabelToIndex("A")).to.equal(1);
    expect(await nft.excelLabelToIndex("Z")).to.equal(26);
    expect(await nft.excelLabelToIndex("AA")).to.equal(27);
    expect(await nft.excelLabelToIndex("AZ")).to.equal(52);
  });
});
