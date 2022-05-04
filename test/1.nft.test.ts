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

describe("Deploy NFT", function () {
  it("should deploy NFT", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(
      "The Meta Sheet NFT",
      "TMSN",
      "https://themetasheet.io"
    );
    nftInstant = await nft.deployed();
    expect(nftInstant).not.equals(undefined);
  });

  it("set cost", async function () {
    const initCost = ethers.utils.parseEther("10.0");
    await nftInstant.setCost(BigNumber.from(initCost));
    const cost = (await nftInstant.cost()).toString();
    expect(cost).equals(initCost);
  });

  it("mint NFT", async function () {
    const [, user] = await ethers.getSigners();
    const userNftInstant = nftInstant.connect(user);

    const mintCount = 10;
    const totalCost = utils.parseEther("100.0");

    const balanceBefore = await waffle.provider.getBalance(nftInstant.address);
    const tx = await userNftInstant.mint(mintCount, {
      value: totalCost,
    });
    tx.wait();

    const balanceOfNFT = await userNftInstant.balanceOf(user.address);
    expect(balanceOfNFT).equals(mintCount);

    const balance = await waffle.provider.getBalance(nftInstant.address);
    const calculatedBalance = new BigNumberJs(balanceBefore.toString())
      .plus(totalCost.toString())
      .toFixed();
    expect(balance.toString()).equals(calculatedBalance);
  });

  it("withdraw collected eth from minted NFT to admin", async function () {
    const [admin] = await ethers.getSigners();

    const balanceOfAdminBefore = await admin.getBalance();
    await (await nftInstant.withdraw()).wait();

    const balanceOfAdminAfter = await admin.getBalance();
    const balanceOfNFTAfter = await waffle.provider.getBalance(
      nftInstant.address
    );
    expect(balanceOfNFTAfter.toString()).to.equals("0");

    expect(
      new BigNumberJs(balanceOfAdminAfter.toString()).isGreaterThan(
        balanceOfAdminBefore.toString()
      )
    ).to.equals(true);
  });
});
