// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    // // Set balance with a condition
    // function setValue(uint256 _amount) public {
    //     require(msg.sender == owner, "You are not the owner of this account");
    //     require(_amount > 0, "Value must be greater than 0");
    //     balance = _amount;
    // }

    // Double the current balance
    function doubleValue() public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 newValue = balance * 2;
        assert(newValue > balance); // Ensure there's no overflow
        balance = newValue;
    }

    // Halve the balance
    function halveValue() public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance > 1, "Balance must be greater than 1 to halve");
        balance /= 2;
    }

    // Increment the balance by a given amount
    function incrementValue(uint256 increment) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(increment > 0, "Increment must be greater than 0");
        balance += increment;
        assert(balance >= increment); // Ensure no overflow
    }

    // Attempt to set the balance to zero
    function tryToSetValueToZero() public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance == 0) {
            revert("Balance is already zero");
        }
        balance = 0;
    }

    // Decrement the balance by a given amount
    function decrementValue(uint256 decrement) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(decrement > 0, "Decrement must be greater than 0");
        require(balance >= decrement, "Decrement exceeds current balance");
        balance -= decrement;
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

}
