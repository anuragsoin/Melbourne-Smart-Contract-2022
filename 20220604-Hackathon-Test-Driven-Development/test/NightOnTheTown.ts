import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, ContractFactory } from "ethers";
import { NightOnTheTown, PartyCash } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let partyCash: PartyCash;
let nightOnTheTown: NightOnTheTown;
let amountEach: BigNumber;

let defaultAdminRole: SignerWithAddress;
let minterRole: SignerWithAddress;
let friend1: SignerWithAddress;
let friend2: SignerWithAddress;
let friend3: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;

describe("Night on the Town", function () {
  beforeEach(async function () {
    [
      defaultAdminRole,
      minterRole,
      friend1,
      friend2,
      friend3,
      addr1,
      addr2,
    ] = await ethers.getSigners();

    // Deploy Party Cash
    const PartyCashFactory = await ethers.getContractFactory("PartyCash");
    partyCash = await PartyCashFactory.deploy();
    await partyCash.deployed();

    // Deploy Night on the Town
    amountEach = BigNumber.from(50*(10^18)); // Each party member will be adding $50 PArty Cash to the kitty
    
    const NightOnTheTownFactory = await ethers.getContractFactory("NightOnTheTown");
    nightOnTheTown = await NightOnTheTownFactory.deploy("Let there be party", partyCash.address, amountEach.toString());
    await nightOnTheTown.deployed();
  });

  it("Should return contract config", async function () {
    expect(true).to.equal(false);
  });
});
