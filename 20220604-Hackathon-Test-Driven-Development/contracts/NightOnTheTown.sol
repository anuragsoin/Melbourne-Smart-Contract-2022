//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
 * @title Night on the Town
 * @author Smart Contract Australia Meetup Group
 * @notice Night on the Town is intended to be a Smart Contract / Use Case 
 * the Meetup group will use to explore aspects of Web3 development.
 * 
 * Night on the Town is about co-ordinating payments as a group of friends 
 * paint the town "red".
 * 
 * The user journey:
 *  - Write
 *      - Create the "night" // Constructor
 *      - Add friend // Auto-deposit
 *      - Start the party
 *      - Pay for fun
 *      - Wrap the party up
 * - Read 
 *      - Title
 *      - Currency
 *      - Amount each
 *      - Friend count
 *      - Balance kitty
 *      - Balance each
 */


contract NightOnTheTown {
    string private greeting;

    bytes32 public constant FRIEND_ROLE = keccak256("FRIEND_ROLE");

    /**
     * @notice Emitted when a friend is added to the party 
     */
    event FriendAdded(address indexed sender);

    /**
     * @notice Emitted when a the party is started
     */
    event PartyStarted(address indexed sender, uint256 friendCount, uint256 balanceTotal);

    /**
     * @notice Emitted when a bill is paid for fun had / to-be-had
     */
    event PayedForFun(address indexed sender, address, uint256 balanceTotal);

    /**
     * @notice Emitted when a the party is wrapped up
     */
    event PartyWrappedUp(address indexed sender, uint256 friendCount, uint256 balanceTotal, uint256 balanceEach);

    /**
     * @notice Create the Night on the Town
     * 
     * @param _title A title for the Night on the Town (e.g. The Wolf Pack rides again)
     * @param _currency The unit of account for the evening (e.g. USDC, WETH)
     * @param _amountEach The amount each friend will add to the kitty
     */
    constructor(string memory _title, address _currency, uint256 _amountEach) {
    }

    /**
     * @notice Adds a friend and takes amount each in party currency
     * 
     * Emits a FriendAdded event
     * 
     * Requirements
     * - A friend can only join once
     * 
     */
    function FriendAdd() external {
    }

    /**
     * @notice Starts the Party
     * 
     * Emits a PartyStarted event
     * 
     * Requirements
     * - The party must have at least 1 friend
     * - The party must be pending
     * - Only the FRIEND_ROLE can execute
     */
    function PartyStart() external {
    }

    /**
     * @notice Pay for fun 
     * 
     * Emits a PayedForFun event
     * 
     * Requirements
     * - The party must be started
     * - The recipient is NOT a friend
     * - The kitty has enough balance
     * - Only the FRIEND_ROLE can execute
     * 
     * @param _recipient The address receiving the payment
     * @param _amount The amount of the payment
     */
    function PayForFun(address _recipient, uint256 _amount) external {
    }

    /**
     * @notice Wrap up the Party and devide the kitty amungst the friends
     * 
     * Emits a PartyWrappedUp event
     * 
     * Requirements
     * - The party must be started
     * - Only the FRIEND_ROLE can execute
     */
    function PartyWrapUp() external {
    }
}
