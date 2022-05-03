import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { BigNumber as BigNumberJs } from "bignumber.js";
// eslint-disable-next-line node/no-missing-import
import { DAOEngine, Governance, MetaSheetDAO, NFT, Token } from "../typechain";
require("@nomiclabs/hardhat-waffle");

chai.use(chaiAsPromised);
const { expect } = chai;

let metaSheetDAOInstant: MetaSheetDAO = undefined as any;
let tokenInstant: Token = undefined as any;
let nftInstant: NFT = undefined as any;
let governanceInstant: Governance = undefined as any;
let governanceTestInstant: Governance = undefined as any;
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

describe("Deploy Governance", function () {
  it("should deploy Governance", async function () {
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(tokenInstant.address);
    governanceInstant = await governance.deployed();
    expect(governanceInstant).not.equals(undefined);
  });
});

describe("Governance tests", function () {
  it("should deploy Governance", async function () {
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(tokenInstant.address);
    governanceTestInstant = await governance.deployed();
    expect(governanceTestInstant).not.equals(undefined);
  });

  it("should create proposal", async function () {
    await governanceTestInstant.createProposal("ok", [0, 0, 0]);
  });

  it("should fail to set proposal executed at #0", async function () {
    return expect(governanceTestInstant.setProposalExecuted(0)).to.eventually
      .rejected;
  });

  it("should set proposal executed #1", async function () {
    await governanceTestInstant.setProposalExecuted(1);
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
    const metaSheetDAO = await MetaSheetDAO.deploy(
      tokenInstant.address,
      nftInstant.address,
      governanceInstant.address
    );
    metaSheetDAOInstant = await metaSheetDAO.deployed();
    expect(metaSheetDAOInstant).not.equals(undefined);
  });
});

describe("Setup MetaSheetDAO", function () {
  it("transfer ownership of Token, NFT and DAOEngine to MetaSheetDAO", async function () {
    await tokenInstant.transferOwnership(metaSheetDAOInstant.address);
    await nftInstant.transferOwnership(metaSheetDAOInstant.address);
    await daoEngineInstant.transferOwnership(metaSheetDAOInstant.address);
    await governanceInstant.transferOwnership(metaSheetDAOInstant.address);
  });

  it("should acquire DAOEngine via proposal", async function () {
    const proposalId = await governanceInstant.proposalCount();
    await metaSheetDAOInstant.createDAOEngineProposal(
      "first daoEngine Setup proposal",
      daoEngineInstant.address
    );
    await metaSheetDAOInstant.vote(proposalId, true);
    await metaSheetDAOInstant.setDAOEngine(proposalId);
  });

  it("should failed to acquire DAOEngine via same proposal", async function () {
    const proposalId = (await governanceInstant.proposalCount()).toNumber() - 1;
    return expect(metaSheetDAOInstant.setDAOEngine(proposalId)).to.eventually
      .rejected;
  });

  it("validate acquired DAOEngine address", async function () {
    return expect(
      metaSheetDAOInstant.getDAOEngineAddress()
    ).to.eventually.become(daoEngineInstant.address);
  });

  it("should failed to validate acquired DAOEngine address with DAOEngineTwo", async function () {
    return expect(
      metaSheetDAOInstant.getDAOEngineAddress()
    ).to.eventually.not.become(daoEngineTwoInstant.address);
  });
});
