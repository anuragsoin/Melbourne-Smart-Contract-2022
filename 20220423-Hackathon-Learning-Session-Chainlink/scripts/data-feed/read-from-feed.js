const {ethers} = require('hardhat');
require('dotenv').config();
const {readApplicationJson, getSigner} = require('../utils.js');
const DataFeedReader = require('../../artifacts/contracts/PriceFeedConsumer.sol/PriceFeedConsumer.json');
const gasConstants = require('../../gas.json');
const {networkConfig} = require('../../helper-hardhat-config');

async function main(){
    const myArgs = process.argv.slice(2);
    const chainId = myArgs[0];
    const networkConf = networkConfig[chainId];
    let applicationData = readApplicationJson();
    let networkName = networkConf["name"];

    let contractAddress = "0x951277782A5b6127D9ebD4983623742cDAc587e2";
    console.log(`on ${networkName} connecting to contract at address ${contractAddress} for checking result\n`);
    let apiConsumer;
    let signer;
    if (chainId === 31337) {
        console.log(`connecting to local chain`);
        [signer] = await ethers.getSigners();
        apiConsumer = await new ethers.Contract(contractAddress, DataFeedReader.abi, signer);
    } else {
        signer = await getSigner(networkName, networkConf["apiKey"]);
        apiConsumer = await new ethers.Contract(contractAddress, DataFeedReader.abi, signer);
    }
    let resultValue = await apiConsumer.getLatestPrice();
    let price = BigInt(resultValue).toString();
    //since data feed sends data at precision of 8 decimals
    console.log(`Latest round data for ETH/USD feed ${ethers.utils.formatUnits(price, 8)}`);

}


main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
