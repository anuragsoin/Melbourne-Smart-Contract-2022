const {ethers} = require('hardhat');
const {readApplicationJson, getSigner} = require('../utils.js');
const {networkConfig} = require('../../helper-hardhat-config');
const ExternalApi = require('../../artifacts/contracts/CheckBalanceWithExternalApi.sol/CheckBalanceWithExternalApi.json');
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
    console.log(`on ${networkName} connecting to contract at address ${contractAddress} for checking result\n`);
    let apiConsumer;
    let signer;
    if (chainId === 31337) {
        console.log(`connecting to local chain`);
        [signer] = await ethers.getSigners();
        apiConsumer = await new ethers.Contract(contractAddress, ExternalApi.abi, signer);
    } else {
        signer = await getSigner(networkName, networkConf["apiKey"]);
        apiConsumer = await new ethers.Contract(contractAddress, ExternalApi.abi, signer);
    }
    let resultValue = await apiConsumer.showResult();
    let value = BigInt(resultValue).toString();
    if (value == 0 && ["hardhat", "localhost", "ganache"].indexOf(networkName) !== 0) {
        console.log("You'll either need to wait another minute, or fix something!");
    } else {
        console.log(`data returned from hedera is ${value}`);
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
