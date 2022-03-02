pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract PaymentServiceV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 private etherBalance; 

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function getEtherbalance() public view returns(uint256) {
        return etherBalance;
    }

    function balance() public view returns(uint256) {
        return address(this).balance;
    }

    function pay(address recipient, uint256 amount) public {
        require(etherBalance > amount);
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Failed to send Ether");
        etherBalance -= amount;
    }

    function depositEther() public payable {
        etherBalance += msg.value;
    } 

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}