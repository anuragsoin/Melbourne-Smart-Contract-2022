require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("@appliedblockchain/chainlink-plugins-fund-link");
require('./tasks');
require('dotenv').config();
const {networkConfig} = require('./helper-hardhat-config.js');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//This is your private key for the N/W
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    mumbai: {
      url: `${networkConfig[80001]["apiURL"]}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001
    },
    kovan: {
      url: `${networkConfig[42]["apiURL"]}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 42,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  //note this is only used for localhost/hardhat deployments not for network deployments
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.2",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  etherscan: {
    apiKey: {
      polygonMumbai: networkConfig[80001]["etherScanKey"],
      kovan: networkConfig[42]["etherScanKey"]
    }
  }
};
