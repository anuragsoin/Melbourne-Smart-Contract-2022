//SPDX-License-Identifier:MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract CheckBalanceWithExternalApi is Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    //data for chainlink API call
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    //populate the result back
    uint256 public result;

    event DataFullFilled(bytes32 requestId, uint256 result);

    constructor(address _oracle, bytes32 _jobId, uint256 _fee, address _link){
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function checkAccountBalance(string memory _hederAccountId) external onlyOwner returns (bytes32){
        // require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        //set the request params
        request.add("type", "account");
        request.add("accountId", _hederAccountId);
        request.add("mint", "false");

        //set the params for parse
        request.add("path", "data,result");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function checkTokenSupply(string memory _hederAccountId) external onlyOwner returns (bytes32){
        // require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        //set the request params
        request.add("type", "token");
        request.add("accountId", _hederAccountId);
        request.add("mint", "false");

        //set the params for parse
        request.add("path", "data,result");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function mintToken(string memory _hederAccountId) external onlyOwner returns (bytes32){
        // require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        //set the request params
        request.add("type", "token");
        request.add("accountId", _hederAccountId);
        request.add("mint", "true");

        //set the params for parse
        request.add("path", "data,result");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    //callback registered as selector
    function fulfill(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        //here take the price mint the token
        emit DataFullFilled(_requestId, _result);
        result = _result;
    }

    function showResult() external view returns(uint256){
        return result;
    }

}
