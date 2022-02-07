const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  it("Deplyment should assign the total supply of the token to the owner", async function () {
    const owner = await ethers.getSigner();
    //console.log("Signers Object:", owner);

    // create instance of the Contract
    const Token = await ethers.getContractFactory("Token");

    //Deployment of Contract
    const hardhatToken = await Token.deploy();

    //using chai assertion to check if the total supply is equal to balance of owner
    const minted = ethers.utils.parseEther("10000000");
    expect(await hardhatToken.totalSupply()).to.equal(minted);

    //using chai assertion to check if the balance of owner is equal to the minted amount
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(minted);
  });
});
