const {ethers} = require('hardhat');
require('dotenv').config();
const {readApplicationJson, getSigner} = require('../utils.js');
const ApiLink = require('../../artifacts/contracts/MultiTokenWithPriceApiConsumer.sol/MultiTokenWithPriceApiConsumer.json');
const gasConstants = require('../../gas.json');
const {networkConfig} = require('../../helper-hardhat-config');

async function main() {
    const args = process.argv.slice(2);
    const chainId = args[0];
    let applicationData = readApplicationJson();
    const networkConf = networkConfig[chainId];
    let networkName = networkConf["name"];
    if (!applicationData.contracts[networkName]["contractAddress"]) {
        console.log(`no contract address is defined for ${networkName}`);
        process.exit(1);
    }
    let contractAddress = applicationData.contracts[networkName].contractAddress;
    const tokenName = "Defi";
    const amount = 50;
    console.log(`on ${networkName} connecting to contract ${contractAddress} and minting the token ${tokenName}`);
    let apiConsumer;
    let signer;
    if (chainId === 31337) {
        console.log(`connecting to local chain`);
        [signer] = await ethers.getSigners();
        apiConsumer = await new ethers.Contract(contractAddress, ApiLink.abi, signer);
    } else {
        signer = await getSigner(networkName, networkConfig["apiKey"]);
        apiConsumer = await new ethers.Contract(contractAddress, ApiLink.abi, signer);
    }
    console.log(`minting the ${tokenName} with amount ${amount}`);
    let tx = await apiConsumer.mintNft(tokenName, amount, {gasLimit: gasConstants.mintGasLimit});
    console.log(`minted tx ${tx.hash}`);
    let receipt = await tx.wait();
    for (let event of receipt.events) {
        console.log(`events at receipt ${JSON.stringify(event)}`);
    }
}

main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
