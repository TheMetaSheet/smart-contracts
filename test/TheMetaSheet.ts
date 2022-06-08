import { expect } from "chai";
import { ethers } from "hardhat";

describe("TheMetaSheet", function () {
  it("Should return the new greeting once it's changed", async function () {
    const TheMetaSheet = await ethers.getContractFactory("TheMetaSheet");
    const theMetaSheet = await TheMetaSheet.deploy("Hello, world!");
    await theMetaSheet.deployed();

    expect(await theMetaSheet.greet()).to.equal("Hello, world!");

    const setGreetingTx = await theMetaSheet.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await theMetaSheet.greet()).to.equal("Hola, mundo!");
  });
});
