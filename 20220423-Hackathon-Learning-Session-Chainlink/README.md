# chainlink-demo-meetup

##1. Consuming existing API in MultiTokenWithPriceApiConsumer ##

In this smart contract we are making a direct request for a real time data from a specific job via a oracle, the API 
that we are calling is [https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD] to get price of ETH/USD from a choosen soruce.

Contract addresses for the same
```json
{
  "contracts": {
    "hardhat": {
      "contractAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    },
    "mumbai": {
      "contractAddress": "0xD3211377F460D387762F6652bA30983D4AC612fC"
    },
    "kovan": {
      "contractAddress": "0xaAEe3205940Caa768CEB6Aef20D4c5BA67ef08C5"
    }
  }
}
```


##2. Consuming data from your API in CheckBalanceWithExternalApi ##

In this smart contract we focus on consuming data from our hosted node, where we have defined a job that gets data from our API i.e. running a
as a serveless function in cloud

we have deployed the same on kovan

```json
{
  "contracts": {
    "hardhat": {
      "contractAddress": ""
    },
    "mumbai": {
      "contractAddress": ""
    },
    "kovan": {
      "contractAddress": "0x7320e39d7c71D5463a6c73dD836CF007E155d6B7"
    }
  }
}
```

Job that we talking to on our node

- Then follow section `Add a job the node section`, Using bridge we can define our job, here in this case bridge name is hedera-data, here note to update the contractAddress of Oracle which is 0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b to your oracle address in 2 places
```
type = "directrequest"
schemaVersion = 1
name = "Check-Hedera-Account"
contractAddress = "0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b"
maxTaskDuration = "0s"
observationSource = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type=cborparse data="$(decode_log.data)"]
    fetch        [type=bridge name="hedera-data" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"type\\": $(decode_cbor.type), \\"accountId\\": $(decode_cbor.accountId), \\"mint\\": $(decode_cbor.mint)}}"]
    parse        [type=jsonparse path="$(decode_cbor.path)" data="$(fetch)"]
    encode_data  [type=ethabiencode abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    encode_tx    [type=ethabiencode
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                 ]
    submit_tx    [type=ethtx to="0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```

##3.Reading external data feed PriceFeedConsumer on Polygon ##
