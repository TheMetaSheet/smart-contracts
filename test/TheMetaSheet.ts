import { expect } from "chai";
import { ethers } from "hardhat";

// eslint-disable-next-line node/no-missing-import
import { NFT, TheMetaSheet, Token } from "../typechain";

describe("TheMetaSheet", function () {
  let nft: NFT, theMetaSheet: TheMetaSheet, token: Token;

  this.beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("TheMetaSheet", "TMS", owner.address, 100);
    await token.deployed();

    const TheMetaSheet = await ethers.getContractFactory("TheMetaSheet");
    theMetaSheet = await TheMetaSheet.deploy(nft.address, token.address);
    await theMetaSheet.deployed();
  });

  it("getNFTAddress: should have same NFT address", async function () {
    const nftAddress = await theMetaSheet.getNFTAddress();
    expect(nft.address).to.equal(nftAddress);
  });
});
