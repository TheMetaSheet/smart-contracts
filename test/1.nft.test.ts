import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { BigNumber as BigNumberJs } from "bignumber.js";
// eslint-disable-next-line node/no-missing-import
import { NFT } from "../typechain";
import { BigNumber } from "ethers";
require("@nomiclabs/hardhat-waffle");

chai.use(chaiAsPromised);
const { expect } = chai;

let nftInstant: NFT = undefined as any;

describe("Deploy NFT", function () {
  it("should deploy NFt", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(
      "The Meta Sheet NFT",
      "TMSN",
      "https://themetasheet.io"
    );
    nftInstant = await nft.deployed();
    expect(nftInstant).not.equals(undefined);
  });

  it("should set cost", async function () {
    const initCost = new BigNumberJs(1).multipliedBy(10 ** 18).toFixed();
    await nftInstant.setCost(BigNumber.from(initCost));
    const cost = (await nftInstant.cost()).toString();
    expect(cost).equals(initCost);
  });

  it("mint NFTs", async function () {
    const [admin] = await ethers.getSigners();
    const mintCount = 10;
    console.log(await admin.getBalance());
    await nftInstant.mint(mintCount, {
      value: 1,
      from: admin.address,
    });
    const balanceOfAdmin = await nftInstant.balanceOf(admin.address);
    expect(balanceOfAdmin).equals(10);
  });
});
