const {readFileSync, writeFileSync} = require('fs');
const {ethers} = require('ethers');

const filePath = './appData.json'

function readApplicationJson() {
    let jsonContext = {};
    try {
        let readFile = readFileSync(filePath);
        jsonContext = JSON.parse(readFile);
    } catch (error) {
        console.log(error);
    }
    if (!jsonContext.contracts) {
        jsonContext.contracts = {};
    }
    if (!jsonContext.contracts.hardhat) {
        jsonContext.contracts.hardhat = {};
    }
    if (!jsonContext.contracts.mumbai) {
        jsonContext.contracts.mumbai = {};
    }
    if (!jsonContext.contracts.kovan) {
        jsonContext.contracts.kovan = {};
    }

    return jsonContext;
}

function writeApplicationJson(jsonData) {
    let stringData = JSON.stringify(jsonData);
    writeFileSync(filePath, stringData);
}

async function getSigner(networkName, networkApiKey){
    const alchemyProvider = await new ethers.providers.AlchemyProvider(network=getAlias(networkName), networkApiKey);
    const signer = await new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, alchemyProvider);
    return signer;
}

async function deployUsingEthers(contract, signer, ...args) {
    let contractFactory = new ethers.ContractFactory(contract.abi, contract.bytecode, signer);
    let contractTx = await contractFactory.deploy.apply(contractFactory, args);
    console.log(`contract deployment transaction initiated awaiting confirmation`);
    await contractTx.deployTransaction.wait();
    return contractTx.address;
}

function getAlias(networkName){
    if(networkName === 'mumbai'){
        return "maticmum";
    }
    return networkName;
}


module.exports = {readApplicationJson, writeApplicationJson, getSigner, deployUsingEthers, getAlias};
