// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency
const {ethers} = require("ethers");
const AUTO_FUND = process.env.AUTO_FUND || true;

const autoFundCheck = async (contractAddr, networkName, linkTokenAddress, fundAmount, signer, additionalMessage) => {
    console.log("Checking to see if contract can be auto-funded with LINK:");
    //check to see if user has enough LINK
    const linkTokenContract = new ethers.Contract(linkTokenAddress, LinkToken.abi, signer);
    const balanceBN = await linkTokenContract.balanceOf(signer.address);
    const balance = balanceBN.toString();
    const contractBalanceBN = await linkTokenContract.balanceOf(contractAddr);
    const contractBalance = BigInt(contractBalanceBN).toString();
    if (balance > fundAmount && fundAmount > 0 && contractBalance < fundAmount) {
        //user has enough LINK to auto-fund
        //and the contract isn't already funded
        return true;
    } else {
        //user doesn't have enough LINK, print a warning
        console.log(
            "Account doesn't have enough LINK to fund contracts, you're deploying to a network where auto funding isnt' done by default, the contract is already funded, or you set AUTO_FUND to false."
        );
        console.log(
            `Please obtain LINK via the faucet at https://faucets.chain.link/${networkName} then run the following command to fund contract with LINK:`
        );
        console.log(
            `npx hardhat fund-link --contract ${contractAddr} --network ${networkName} ${additionalMessage}`
        );
        return false;
    }
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e);
        }
    }
}

module.exports = {
    autoFundCheck,
    verify,
}
