import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT, TheMetaSheet } from "../typechain";

describe("TheMetaSheet", function () {
  let nft: NFT, theMetaSheet: TheMetaSheet;

  this.beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    const TheMetaSheet = await ethers.getContractFactory("TheMetaSheet");
    theMetaSheet = await TheMetaSheet.deploy(nft.address);
    await theMetaSheet.deployed();
  });

  it("getNFTAddress: should have same NFT address", async function () {
    const nftAddress = await theMetaSheet.getNFTAddress();
    expect(nft.address).to.equal(nftAddress);
  });
});
