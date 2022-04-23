const {ethers} = require('ethers');
require('dotenv').config();
const {readApplicationJson, writeApplicationJson, getSigner, deployUsingEthers} =require('../utils.js');
//here you need to give the contract you want to deploy
const ApiLink = require('../../artifacts/contracts/MultiTokenWithPriceApiConsumer.sol/MultiTokenWithPriceApiConsumer.json');
const {networkConfig} = require("../../helper-hardhat-config");
const gasConstants = require('../../gas.json');

deploy = async(chainId, deployContract) =>{
    if(chainId == 31337){
        console.log(`cant deploy on test network using these scripts\n`);
        console.log(`use npx hardhat deploy\n`);
        process.exit(1);
    }
    const appData = readApplicationJson();
    const networkConf = networkConfig[chainId];
    let networkName = networkConf["name"];
    console.log(`deploying on chainId ${chainId} with name ${networkName}\n`);

    const signer = await getSigner(networkName, networkConf["apiKey"]);
    const ethBalance = await signer.getBalance();
    console.log(`our signer is ${signer.address} and it's balance is ${ethBalance}`);
    const jobId = ethers.utils.toUtf8Bytes(networkConf["jobId"]);
    const fee = networkConf["fee"];
    //here deploy
    if(deployContract){
        let contractAddress = await deployUsingEthers(ApiLink, signer, process.env.BASE_URI, networkConf["oracle"], jobId, fee, networkConf["linkToken"], {gasLimit: gasConstants.deployGasLimt});
        appData.contracts[networkName]["contractAddress"] = contractAddress;
    }else{
        console.log(`constructor args are ${process.env.BASE_URI} ${networkConf["oracle"]} ${jobId} ${fee} ${networkConf["linkToken"]}`);
        console.log(`contract deployed property is marked as false thus not deploying contract`)
    }

    console.log(`contract is deployed and it's address is ${appData.contracts[networkName]["contractAddress"]}`);

    writeApplicationJson(appData);
}

module.exports = {deploy};
