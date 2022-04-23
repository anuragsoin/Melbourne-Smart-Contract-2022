//SPDX-License-Identifier:MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// This contract- enables you to mint a token for an asset as ERC20 or ERC721
// This has an chain link API integration where we get the ETH-USD price and give that as a price of the token
contract MultiTokenWithPriceApiConsumer is ERC1155, Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;
    using Counters for Counters.Counter;

    Counters.Counter internal _tokenIdCounter;
    string public constant PRICE_API = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD";
    string public constant PRICE_JSON_PATH = "RAW.ETH.USD.PRICE";
    string public baseUri;

    //This is data of token
    struct TokenInfo {
        uint256 tokenId;
        string tokenName;
        uint256 tokenPrice;
    }

    //This is for data of chainlink
    struct RequestData {
        uint256 tokenId;
        uint256 amount;
        address sendToAddress;
    }

    //data for chainlink API call
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    //this is to consume aysnc response from the chainLink
    mapping(bytes32 => RequestData) internal _requestIdToData;
    //This is to link the data to tokenInfo-
    mapping(uint256 => TokenInfo) internal _tokenIdToTokenInfo;
    //This is for quick cross check
    mapping(string => uint256) internal _nameToTokenId;

    event DataFullFilled(bytes32 requestId, uint256 price);

    constructor(string memory _baseUri,
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        address _link) ERC1155(_baseUri){
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        baseUri = _baseUri;
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function mintNft(string memory _name, uint256 _amount) public onlyOwner returns (bytes32){
        require(bytes(_name).length > 0, "can't have empty token reference");
        require(_nameToTokenId[_name] == 0, "token of this name is already minted");
        require(_amount > 0, 'amount have to be be atleast 1 or greater than that');

        return requestPriceData(_name, _amount);
    }

    function requestPriceData(string memory _name, uint256 _amount) internal returns (bytes32){
        // require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        //set the URL to get Price of the ether and set on token
        //1. get the task of getting HTTP get
        request.add("get", PRICE_API);
        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "PRICE": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        //2. do parse using the json parse task
        request.add("path", PRICE_JSON_PATH);

        //3. take the price and add multiplier
        int256 timesAmount = 10 ** 18;
        request.addInt("times", timesAmount);

        //4. Sends the request
        bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);

        //5. increment everything
        //start with 1
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        //populate internal values
        _nameToTokenId[_name] = tokenId;
        _tokenIdToTokenInfo[tokenId] = TokenInfo(tokenId, _name, 0);
        _requestIdToData[requestId] = RequestData(tokenId, _amount, _msgSender());
        return requestId;
    }


    //callback registered as selector
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
        //here take the price mint the token
        emit DataFullFilled(_requestId, _price);

        RequestData memory requestData = _requestIdToData[_requestId];

        //mint the token
        _mint(requestData.sendToAddress, requestData.tokenId, requestData.amount, "");

        //populate price on internal structure
        _tokenIdToTokenInfo[requestData.tokenId].tokenPrice = _price;

        delete _requestIdToData[_requestId];
    }

    //you could point this to s3 bucket and then get json from there
    function uri(uint256 tokenId) public view virtual override returns (string memory){
        string memory _name = _tokenIdToTokenInfo[tokenId].tokenName;
        return
        string(
            abi.encodePacked(
                baseUri,
                _name,
                ".json"
            )
        );
    }

    function getTokenDetailsForName(string memory _name) external view returns (TokenInfo memory){
        uint256 tokenId = _nameToTokenId[_name];
        return _tokenIdToTokenInfo[tokenId];
    }

    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory){
        return _tokenIdToTokenInfo[tokenId];
    }
}