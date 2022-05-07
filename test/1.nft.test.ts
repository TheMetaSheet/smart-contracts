import { ethers, waffle } from "hardhat";

import chaiAsPromised from "chai-as-promised";
import chai from "chai";
// eslint-disable-next-line node/no-missing-import
import { NFT } from "../typechain";
import { BigNumber, utils } from "ethers";
import { BigNumber as BigNumberJs } from "bignumber.js";
require("@nomiclabs/hardhat-waffle");

chai.use(chaiAsPromised);
const { expect } = chai;
let nftInstant: NFT = undefined as any;
const print = (...args: any[]) => {
  console.log("      ", ...args);
};

describe("Deploy NFT", function () {
  context("✦ Should deploy NFT", async function () {
    it("done", async function () {
      const NFT = await ethers.getContractFactory("NFT");
      const nft = await NFT.deploy(
        "The Meta Sheet NFT",
        "TMSN",
        "https://themetasheet.io"
      );
      nftInstant = await nft.deployed();
      expect(nftInstant).not.equals(undefined);
    });
  });

  context("✦ Set cost", async function () {
    it("done", async function () {
      const initCost = ethers.utils.parseEther("10.0");
      await nftInstant.setCost(BigNumber.from(initCost));
      const cost = (await nftInstant.cost()).toString();
      expect(cost).equals(initCost);
    });
  });

  context("✦ Mint NFT", async function () {
    it("done", async function () {
      const [, user] = await ethers.getSigners();
      const userNftInstant = nftInstant.connect(user);
      const mintCount = 10;
      const totalCost = 100;
      const totalCostEth = utils.parseEther(`${totalCost.toString()}.0`);
      print("mint count:", mintCount);
      print("total cost for:", totalCost, "eth");
      const balanceBefore = await waffle.provider.getBalance(
        nftInstant.address
      );
      const tx = await userNftInstant.mint(mintCount, {
        value: totalCostEth,
      });
      tx.wait();

      const balanceOfNFT = await userNftInstant.balanceOf(user.address);
      expect(balanceOfNFT).equals(mintCount);

      const balance = await waffle.provider.getBalance(nftInstant.address);
      const calculatedBalance = new BigNumberJs(balanceBefore.toString())
        .plus(totalCostEth.toString())
        .toFixed();
      expect(balance.toString()).equals(calculatedBalance);

      print("calculatedBalance:", utils.formatEther(calculatedBalance), "eth");
    });
  });

  context(
    "✦ Withdraw collected eth from minted NFT to admin",
    async function () {
      it("done", async function () {
        const [admin] = await ethers.getSigners();

        print("admin address:", admin.address);

        const balanceOfAdminBefore = (await admin.getBalance()).toString();
        await (await nftInstant.withdraw()).wait();

        const balanceOfAdminAfter = (await admin.getBalance()).toString();
        const balanceOfNFTAfter = await waffle.provider.getBalance(
          nftInstant.address
        );
        expect(balanceOfNFTAfter.toString()).to.equals("0");
        expect(
          new BigNumberJs(balanceOfAdminAfter).isGreaterThan(
            balanceOfAdminBefore
          )
        ).to.equals(true);

        print(
          "balance of admin before withdraw:",
          utils.formatEther(balanceOfAdminBefore)
        );

        print(
          "balance of admin after withdraw:",
          utils.formatEther(balanceOfAdminAfter)
        );
      });
    }
  );

  context("✦ number to column name", async function () {
    it("done", async function () {
      const list = [];
      for (let i = 0; i < 100; i++) {
        list.push(`${i} = ${await nftInstant.numberToColName(i)}`);
      }
      print("converted chars from 0 - 100:", ...list);
    });
  });
});
