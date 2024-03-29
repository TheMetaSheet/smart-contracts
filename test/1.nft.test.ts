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

function numberToColName(n: number) {
  n -= 1;
  const ordA = "a".charCodeAt(0);
  const ordZ = "z".charCodeAt(0);
  const len = ordZ - ordA + 1;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}

function colNameToNumber(letters: string) {
  let n = 0;
  for (let p = 0; p < letters.length; p++) {
    n = letters[p].charCodeAt(0) - 64 + n * 26;
  }
  return n;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const mintedIds: string[] = [];

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

  context("✦ Number to column letters", async function () {
    it("done", async function () {
      const list = [];
      for (let i = 1; i < 101; i++) {
        const solidityValue = await nftInstant.numberToColName(i);
        const jsValue = numberToColName(i).toUpperCase();
        expect(`${solidityValue}`).to.equals(jsValue);
        list.push(`${i} = ${solidityValue}`);
      }
      print("converted chars from 0 - 100:", ...list);
    });
  });

  context("✦ Column letters to number", async function () {
    it("done", async function () {
      const list = [];
      for (let i = 1; i < 101; i++) {
        const solidityValue = (
          await nftInstant.colNameToNumber(numberToColName(i).toUpperCase())
        ).toNumber();
        const jsValue = colNameToNumber(numberToColName(i).toUpperCase());
        expect(solidityValue).to.equals(jsValue);
        list.push(`${numberToColName(i).toUpperCase()} = ${solidityValue}`);
      }
      print(`converted number from a - ${numberToColName(99)}:`, ...list);
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
      for (let index = 1; index <= mintCount; index++) {
        mintedIds[index - 1] = index.toString();
        const columnName = numberToColName(getRandomInt(1, 100)).toUpperCase();
        const rowNumber = getRandomInt(1, 100);
        print("cell", `${columnName}${rowNumber}`);
        const tx = await userNftInstant.mintByColumnNameAndRowNumber(
          columnName,
          rowNumber,
          {
            value: utils.parseEther(`10.0`),
          }
        );
        tx.wait();
      }

      print(
        "wallet",
        (await userNftInstant.walletOfOwner(user.address)).join(",")
      );

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

  context("✦ Transfer NFTs to another user", async function () {
    it("done", async function () {
      const [, user, anotherUser] = await ethers.getSigners();

      const userNftInstant = nftInstant.connect(user);
      print(
        "user NFTs before: ",
        (await userNftInstant.walletOfOwner(user.address)).join(", ")
      );
      for (let index = 1; index <= mintedIds.length - 5; index++) {
        await userNftInstant.transferFrom(
          user.address,
          anotherUser.address,
          mintedIds[index]
        );
      }

      print(
        "user NFTs after: ",
        (await userNftInstant.walletOfOwner(user.address)).join(", ")
      );

      print(
        "another user NFTs: ",
        (await nftInstant.walletOfOwner(anotherUser.address)).join(", ")
      );
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
});
