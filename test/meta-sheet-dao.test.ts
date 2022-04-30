import { ethers } from "hardhat";
require("@nomiclabs/hardhat-waffle");

describe("MetaSheetDAO", function () {
  it("Should deploy MetaSheetDAO", async function () {
    const MetaSheetDAO = await ethers.getContractFactory("MetaSheetDAO");
    const metaSheetDAO = await MetaSheetDAO.deploy();
    await metaSheetDAO.deployed();
  });
});
