// deploy fakeUSDT contract
import { ethers } from "hardhat";

async function main() {
  const RPSFactory = await ethers.getContractFactory("RPS");
  const RPSContract = await RPSFactory.deploy(
    "0x2f758DE9c4B83ed1a3B777b5f905d46Fa1c2C725"
  );
  await RPSContract.waitForDeployment();

  console.log("Contract deployed to:", RPSContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});