const networkConfig = {
    default: {
        name: "hardhat",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "1000000000000000000",
        keepersUpdateInterval: "30",
        apiKey: ""
    },
    31337: {
        name: "localhost",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "1000000000000000000",
        keepersUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        apiKey: ""
    },
    42: {
        name: "kovan",
        linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
        oracle: "0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b",
        jobId: "a41d012f6b6a4fc5ba0dcde90df6895e",
        fee: "100000000000000000",
        fundAmount: "100000000000000000", // 0.1
        apiKey: "cppEBH89lm7jjbzf517LDcWpKfbjVooz",
        apiURL: "https://eth-kovan.alchemyapi.io/v2/cppEBH89lm7jjbzf517LDcWpKfbjVooz",
        etherScanKey:"TXCZ5J64MB8A2V2P6CX51IP6FTGBBQRIIB"
    },
    80001: {
        name: "mumbai",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        oracle: "0xc8d925525ca8759812d0c299b90247917d4d4b7c",
        jobId: "bbf0badad29d49dc887504bacfbb905b",
        fee: "10000000000000000", //0.01
        fundAmount: "100000000000000",
        apiKey: "aSGCMHZr7d07XcDuNponTXAk0I4xo94l",
        apiURL: "https://polygon-mumbai.g.alchemy.com/v2/aSGCMHZr7d07XcDuNponTXAk0I4xo94l",
        etherScanKey:"X9GANVKDJU2BNXFDFG2XDGPPCRGN2149SX"
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
