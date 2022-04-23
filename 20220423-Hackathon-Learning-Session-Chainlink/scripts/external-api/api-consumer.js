const {ethers} = require('hardhat');
require('dotenv').config();
const {readApplicationJson, getSigner} = require('../utils.js');
const ExternalApi = require('../../artifacts/contracts/CheckBalanceWithExternalApi.sol/CheckBalanceWithExternalApi.json');
const gasConstants = require('../../gas.json');
const {networkConfig} = require('../../helper-hardhat-config');

async function main() {
    const args = process.argv.slice(2);
    const chainId = args[0];
    const accountId = args[1]
    const operationName = args[2];
    let applicationData = readApplicationJson();
    const networkConf = networkConfig[chainId];
    let networkName = networkConf["name"];
    if (!applicationData.contracts[networkName]["contractAddress"]) {
        console.log(`no contract address is defined for ${networkName}`);
        process.exit(1);
    }
    let contractAddress = applicationData.contracts[networkName].contractAddress;
    console.log(`on ${networkName} connecting to contract ${contractAddress} and doing operation ${operationName}`);
    let apiConsumer;
    let signer;
    if (chainId === 31337) {
        console.log(`connecting to local chain`);
        [signer] = await ethers.getSigners();
        apiConsumer = await new ethers.Contract(contractAddress, ExternalApi.abi, signer);
    } else {
        signer = await getSigner(networkName, networkConfig["apiKey"]);
        apiConsumer = await new ethers.Contract(contractAddress, ExternalApi.abi, signer);
    }
    let apiTransaction;
    if(operationName === 'account'){
        apiTransaction = await apiConsumer.checkAccountBalance(accountId, {gasLimit: gasConstants.requestGasLimit});
    }else if(operationName === 'token'){
        apiTransaction = await apiConsumer.checkTokenSupply(accountId, {gasLimit: gasConstants.requestGasLimit});
    }else if(operationName === 'mint'){
        apiTransaction = await apiConsumer.mintToken(accountId, {gasLimit: gasConstants.requestGasLimit});
    }else{
        console.log(`sorry I cant do the operation ${operationName} you requested`);
    }
    console.log(`minted tx ${apiTransaction.hash}`);
    let receipt = await apiTransaction.wait();
    for (let event of receipt.events) {
        console.log(`events at receipt ${JSON.stringify(event)}`);
    }
}

main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
