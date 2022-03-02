// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function main() {

  const PaymentServiceV1 = await ethers.getContractFactory("PaymentServiceV1");
  const paymentServiceV1 = await upgrades.deployProxy(PaymentServiceV1);
  await paymentServiceV1.deployed();
  console.log("Payment Service V1 deployed to:", paymentServiceV1.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
