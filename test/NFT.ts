import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT } from "../typechain";

async function ensureError(fn: Function) {
  try {
    await fn();
    expect(0).to.equal(1);
  } catch (error) {
    expect(1).to.equal(1);
  }
}

describe("NFT", function () {
  let nft: NFT;
  let NFT;

  this.beforeEach(async () => {
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();
  });

  describe("excelLabelToIndex", () => {
    it("should return correct index for all label", async function () {
      expect(await nft.excelLabelToIndex("A")).to.equal(1);
      expect(await nft.excelLabelToIndex("Z")).to.equal(26);
      expect(await nft.excelLabelToIndex("AA")).to.equal(27);
      expect(await nft.excelLabelToIndex("AZ")).to.equal(52);
    });

    it("should return error for wrong index", async function () {
      const NFT = await ethers.getContractFactory("NFT");
      const nft = await NFT.deploy();
      await nft.deployed();
      await ensureError(async () => {
        await nft.excelLabelToIndex("A,");
      });

      await ensureError(async () => {
        await nft.excelLabelToIndex("");
      });

      await ensureError(async () => {
        await nft.excelLabelToIndex("#A");
      });
    });
  });

  describe("mint", () => {
    it("mint NFT by col & row", async () => {
      const tx = await nft.mint("A", 1);
      await tx.wait();
      const tx1 = await nft.mint("A", 3);
      await tx1.wait();

      const [owner] = await ethers.getSigners();
      const nfts = await nft.getNFTsByAddress(owner.address);

      expect(nfts[0].toString()).to.equal("1");
      expect(nfts[1].toString()).to.equal("2");
    });

    it("mint NFT by col & row bound of index", async () => {
      await ensureError(async () => {
        await nft.mint("A", 100);
      });

      await ensureError(async () => {
        await nft.mint("AAAA", 1);
      });
    });
  });

  describe("getNFTbyColAndRowNumber", () => {
    it("mint NFT and try to get NFT fro specific row & col", async () => {
      const tx = await nft.mint("A", 1);
      await tx.wait();

      const token = await nft.getNFTbyColAndRowNumber("A", 1);
      expect(token.toString()).to.equal("1");
    });
  });
});
