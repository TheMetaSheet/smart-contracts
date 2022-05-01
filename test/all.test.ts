import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { BigNumber as BigNumberJs } from "bignumber.js";
// eslint-disable-next-line node/no-missing-import
import { MetaSheetDAO, NFT, Token } from "../typechain";
require("@nomiclabs/hardhat-waffle");

chai.use(chaiAsPromised);
const { expect } = chai;

let metaSheetDAOInstant: MetaSheetDAO = undefined as any;
let tokenInstant: Token = undefined as any;
let nftInstant: NFT = undefined as any;

describe("Token", function () {
  it("should deploy Token", async function () {
    const [admin] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(
      "The Meta Sheet DAO Token",
      "TMSDT",
      admin.address,
      new BigNumberJs(1000000000).multipliedBy(10 ** 18).toFixed()
    );
    tokenInstant = await token.deployed();
    expect(tokenInstant).not.equals(undefined);
  });
});

describe("NFT", function () {
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
});

describe("MetaSheetDAO", function () {
  it("should deploy MetaSheetDAO", async function () {
    const MetaSheetDAO = await ethers.getContractFactory("MetaSheetDAO");
    const metaSheetDAO = await MetaSheetDAO.deploy();
    metaSheetDAOInstant = await metaSheetDAO.deployed();
    expect(metaSheetDAOInstant).not.equals(undefined);
  });

  it("should set Token address", async function () {
    await metaSheetDAOInstant.setToken(tokenInstant.address);
    expect(await metaSheetDAOInstant.getTokenAddress()).equals(
      tokenInstant.address
    );
  });

  it("should fail to set Token address again", async function () {
    return expect(metaSheetDAOInstant.setToken(tokenInstant.address)).to
      .eventually.rejected;
  });
});
