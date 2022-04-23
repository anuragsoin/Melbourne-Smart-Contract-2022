//SPDX-License-Identifier:MIT
pragma solidity ^0.8.2;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeedConsumer {
    //Immutable state variables can only be assigned during contract creation,
    //but will remain constant throughout the life-time of a deployed contract.
    AggregatorV3Interface internal immutable priceFeed;

    constructor(address _priceFeedAddress){
        //initialise the feed here
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function getLatestPrice() public view returns(int256){
        (
        uint80 roundID,
        int256 price,
        uint256 startedAt,
        uint256 timeStamp,
        uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getPriceFeed() public view returns(AggregatorV3Interface){
        return priceFeed;
    }

}
