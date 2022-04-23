const {autoFundCheck} = require('../helper-function');
const {networkConfig} = require("../helper-hardhat-config");
const {readApplicationJson, getSigner} = require('../scripts/utils');
require('dotenv').config();
task("check-link-funds", "Checks balance of link token and if needed auto fund it")
    .addParam("chainid", "the chainlink id for the network")
    .setAction(async (taskArgs) => {
        const appData = readApplicationJson();
        const autoFund = process.env.AUTO_FUND;
        const networkConf = networkConfig[taskArgs.chainid];
        if (!networkConf) {
            console.log(`for given chainId ${chainid} there is no network conf in helper-hardhat-config`);
            return;
        }
        const networkName = networkConf["name"];
        const contractAddress = appData.contracts[networkName]["contractAddress"];
        if (!contractAddress) {
            console.log(`no contract address is defined for networkName ${networkName} so can't check funds`);
        }
        const signer = await getSigner(networkName, networkConf['apiKey']);
        const balance = await autoFundCheck(contractAddress, networkName, networkConf["linkToken"], networkConf["fundAmount"], signer, "");
        if(!balance && autoFund){
            //balance is less lets try funding the contract on network
            console.log(`autoFund is marked true in .env so trying to fund the contractAddress ${contractAddress} with some LINK tokens ${networkConf["linkToken"]}`);
            await hre.run("fund-link", {contract: contractAddress, linkaddress: networkConf["linkToken"]});
        }else{
            console.log(`have enough LinkTokens not funding`);
        }
    });

module.exports={}