import { ethers } from "hardhat";

async function main() {
  const [admin] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "Rovelens",
    "RLNS",
    admin.address,
    1000000000
  );
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
