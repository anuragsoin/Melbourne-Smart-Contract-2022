const {ethers} = require('hardhat');
const {readApplicationJson, getSigner} = require('../utils.js');
const {networkConfig} = require('../../helper-hardhat-config');
const ApiLink = require('../../artifacts/contracts/MultiTokenWithPriceApiConsumer.sol/MultiTokenWithPriceApiConsumer.json');
require('dotenv').config();

async function main() {
    const myArgs = process.argv.slice(2);
    const chainId = myArgs[0];
    const networkConf = networkConfig[chainId];
    let applicationData = readApplicationJson();
    let networkName = networkConf["name"];
    if (!applicationData.contracts[networkName].contractAddress) {
        console.log(`no contract address is defined for ${networkName}`);
        process.exit(1);
    }
    let contractAddress = applicationData.contracts[networkName].contractAddress;
    console.log(`on ${networkName} connecting to contract at address ${contractAddress} for checking tokenPrice\n`);
    let apiConsumer;
    let signer;
    let tokenId = 4;
    if (chainId === 31337) {
        console.log(`connecting to local chain`);
        [signer] = await ethers.getSigners();
        apiConsumer = await new ethers.Contract(contractAddress, ApiLink.abi, signer);
    } else {
        signer = await getSigner(networkName, networkConf["apiKey"]);
        apiConsumer = await new ethers.Contract(contractAddress, ApiLink.abi, signer);
    }
    console.log(`checking price for tokenId ${tokenId}`);
    let tokenInfo = await apiConsumer.getTokenInfo(tokenId);
    console.log(`received ${JSON.stringify(tokenInfo)} data for tokenId: ${tokenId}\n`);
    let tokenPrice = BigInt(tokenInfo[2]).toString();
    if (tokenPrice == 0 && ["hardhat", "localhost", "ganache"].indexOf(networkName) !== 0) {
        console.log("You'll either need to wait another minute, or fix something!");
    } else {
        console.log(`tokenId ${tokenId} name is ${tokenInfo[1]} and price in USD is ${ethers.utils.formatUnits(tokenPrice, 'ether')}`);
    }
    if (["hardhat", "localhost", "ganache"].indexOf(networkName) === 0) {
        console.log(`you need to send data yourself for local`);
    }
}

main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
