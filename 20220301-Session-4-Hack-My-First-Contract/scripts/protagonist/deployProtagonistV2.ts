// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EthereumProvider } from "hardhat/types";

let defaultRole: SignerWithAddress; // DEFAULT_ADMIN_ROLE Address with highest level of authority. Typically remains in cold storage

async function main() {

  [
    defaultRole
  ] = await ethers.getSigners();

  const PaymentServiceV2 = await ethers.getContractFactory("PaymentServiceV2");

  const contractV1Address = "0x000000000000" // <========== FILL THIS
  
  const paymentServiceV2: any = await upgrades.upgradeProxy(
    contractV1Address,
    PaymentServiceV2
  );

  console.log("Payment Service upgraded from V1 to V2 at ", paymentServiceV2)

  await paymentServiceV2.balance()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
