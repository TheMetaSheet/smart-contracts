/* eslint-disable node/no-unsupported-features/es-syntax */
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Token } from "../typechain";
require("@nomiclabs/hardhat-waffle");

let _token: Token;
const totalSupply = 1000000000;

async function getToken() {
  const [admin] = await ethers.getSigners();
  if (!_token) {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(
      "MyFirstToken",
      "MFT",
      admin.address,
      totalSupply
    );
    await token.deployed();
    _token = token;
  }
  return _token;
}

const holders: string[] = [];

describe("Token", function () {
  it("Should deploy Token & get token", async function () {
    const token = await getToken();
    expect(token).to.not.equals(undefined).to.not.equals(null);
  });

  it(`Match totalSupply to ${totalSupply}`, async function () {
    const token = await getToken();

    expect(await token.totalSupply()).to.equals(
      BigNumber.from(`${1000000000n * 10n ** 18n}`)
    );
  });

  it("transfer 5 test account", async function () {
    const token = await getToken();
    for (let index = 0; index < holders.length; index++) {
      const userAddress = holders[index];
      const tx = await token.transfer(
        userAddress,
        BigNumber.from(100 * 10 * 18)
      );
      await tx.wait();
      expect(await token.balanceOf(userAddress)).equals(
        BigNumber.from(100 * 10 * 18)
      );
    }
    expect(holders.length).equals(0);
  });

  it("balanceOf admin should be totalSupply", async function () {
    const [admin] = await ethers.getSigners();
    const token = await getToken();
    expect(await (await token.balanceOf(admin.address)).toString()).equals(
      await (await token.totalSupply()).toString()
    );
  });
});
