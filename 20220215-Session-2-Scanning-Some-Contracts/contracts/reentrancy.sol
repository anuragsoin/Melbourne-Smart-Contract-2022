// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// THIS CONTRACT CONTAINS A BUG - DO NOT USE
contract MyDeposit {
    /// @dev Mapping of ether shares of the contract.
    address private owner;
    uint256 private balance;


    constructor(uint _value){
        owner = msg.sender;
        balance = _value;
    }

    modifier onlyOwner(){
         require(owner == msg.sender, "You don't belong here");
         _;
      }

    function changeOwner() public {
         owner = msg.sender;
    }       


    /// reentrancy
    function withdraw() public onlyOwner {
        balance = 0;        
        msg.sender.call{value: balance}("");
    }
}