const {verify} = require('../helper-function');
const {readApplicationJson} = require("./utils");
const {networkConfig} = require("../helper-hardhat-config");
const {ethers, network} = require("hardhat");

async function main(){
    const chainId = network.config.chainId;
    let applicationData = readApplicationJson();
    const networkConf = networkConfig[chainId];
    let networkName = networkConf["name"];
    if (!applicationData.contracts[networkName]["contractAddress"]) {
        console.log(`no contract address is defined for ${networkName}`);
        process.exit(1);
    }
    let contractAddress = applicationData.contracts[networkName].contractAddress;
    const jobId = ethers.utils.toUtf8Bytes(networkConf["jobId"]);
    const fee = networkConf["fee"];

    await verify(contractAddress, [process.env.BASE_URI, networkConf["oracle"], jobId, fee, networkConf["linkToken"]]);
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(-1);
    });