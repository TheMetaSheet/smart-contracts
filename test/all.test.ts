import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { BigNumber as BigNumberJs } from "bignumber.js";
// eslint-disable-next-line node/no-missing-import
import { DAOEngine, MetaSheetDAO, NFT, Token } from "../typechain";
require("@nomiclabs/hardhat-waffle");

chai.use(chaiAsPromised);
const { expect } = chai;

let metaSheetDAOInstant: MetaSheetDAO = undefined as any;
let tokenInstant: Token = undefined as any;
let nftInstant: NFT = undefined as any;
let daoEngineInstant: DAOEngine = undefined as any;
let daoEngineTwoInstant: DAOEngine = undefined as any;

describe("Deploy Token", function () {
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
});

describe("Deploy DAOEngine: 1", function () {
  it("should deploy DAOEngine", async function () {
    const DAOEngine = await ethers.getContractFactory("DAOEngine");
    const daoEngine = await DAOEngine.deploy();
    daoEngineInstant = await daoEngine.deployed();
    expect(daoEngineInstant).not.equals(undefined);
  });
});

describe("Deploy DAOEngine: 2", function () {
  it("should deploy DAOEngine 1", async function () {
    const DAOEngine = await ethers.getContractFactory("DAOEngine");
    const daoEngine = await DAOEngine.deploy();
    daoEngineTwoInstant = await daoEngine.deployed();
    expect(daoEngineTwoInstant.address).not.equals(daoEngineInstant.address);
  });
});

describe("DAOEngine: test", function () {
  let daoEngineInstant: DAOEngine = undefined as any;

  it("should deploy DAOEngine again for test", async function () {
    const DAOEngine = await ethers.getContractFactory("DAOEngine");
    const daoEngine = await DAOEngine.deploy();
    daoEngineInstant = await daoEngine.deployed();
    expect(daoEngineInstant.address).not.equals(null);
  });

  it("should lock it", async function () {
    await daoEngineInstant.lock();
    return expect(daoEngineInstant.lock()).to.eventually.rejected;
  });

  it("should failed to lock it again", async function () {
    return expect(daoEngineInstant.lock()).to.eventually.rejected;
  });
});

describe("Deploy MetaSheetDAO", function () {
  it("should deploy MetaSheetDAO", async function () {
    const MetaSheetDAO = await ethers.getContractFactory("MetaSheetDAO");
    const metaSheetDAO = await MetaSheetDAO.deploy();
    metaSheetDAOInstant = await metaSheetDAO.deployed();
    expect(metaSheetDAOInstant).not.equals(undefined);
  });
});

describe("Setup MetaSheetDAO", function () {
  it("transfer ownership of Token, NFT and DAOEngine to MetaSheetDAO", async function () {
    await tokenInstant.transferOwnership(metaSheetDAOInstant.address);
    await nftInstant.transferOwnership(metaSheetDAOInstant.address);
    await daoEngineInstant.transferOwnership(metaSheetDAOInstant.address);
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

  it("should set NFT address", async function () {
    await metaSheetDAOInstant.setNFT(nftInstant.address);
    expect(await metaSheetDAOInstant.getNFTAddress()).equals(
      nftInstant.address
    );
  });

  it("should fail to set NFT address again", async function () {
    return expect(metaSheetDAOInstant.setNFT(nftInstant.address)).to.eventually
      .rejected;
  });

  it("should acquire DAOEngine", async function () {
    await metaSheetDAOInstant.setDAOEngine(daoEngineInstant.address);
  });

  it("should failed to acquire same DAOEngine", async function () {
    return expect(metaSheetDAOInstant.setDAOEngine(daoEngineInstant.address)).to
      .eventually.rejected;
  });

  it("should failed acquire fresh DAOEngine 2 without ownership", async function () {
    return expect(metaSheetDAOInstant.setDAOEngine(daoEngineTwoInstant.address))
      .to.eventually.rejected;
  });

  it("transfer ownership & should acquire DAOEngine 2", async function () {
    await daoEngineTwoInstant.transferOwnership(metaSheetDAOInstant.address);
    await metaSheetDAOInstant.setDAOEngine(daoEngineTwoInstant.address);
  });
});
