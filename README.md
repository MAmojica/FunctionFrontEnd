# Integrating Frontend with a Smart Contract


This project is part of the **Metacrafters ETH+AVAX Proof** course.

In this project, we had to integrate Frontend with a Smart Contract

To get the project dependencies, run this command in the project root folder

```
npm i
```

### The project consists of three parts

1. **Hardhat local blockchain**: Hardhat allows us to create a local blockchain with demo accounts, where we can deploy our smart contract, and interact with it.

To initialize a local blockchain environment:

```
npx hardhat node
```

We have to add this local network to our **Metamask Wallet** in order to access it.

2. **Smart Contract Deployment**: Once the blockchain environment is live, we can deploy our smart contract using a deploy script. The deploy script compiles the smart contract and passes the initial value to the constructor, and deploys the contract to the blockchain. We can get address of the smart contract by using the reference variable assigned while loading the contract.

To deploy the contract

```
npx hardhat run --network localhost scripts/deploy.js
```

3. **Frontend**: Frontend has been made using Next.js. The frontend helps us connect with the **Metamask wallet**. After establishing the connection, we can see the **Deposit** and **Withdraw** interface. Just enter the desired amount in the textbox and click **Deposit** or **Withdraw**, it will redirect you to Metamask wallet for confirmation, after verifying the transaction, the amount will be transferred and the balance will be updated in the frontend.

## Description

This Solidity program is a simple program that demonstrates how a smart contract interacts with a frontend webpage while implementing the require(), assert(), and revert() statements.

The contract has six functions:

- `getBalance(uint256 _value)`: Sets the value if it meets the required condition.
- `doubleValue()`: Doubles the current value.
- `tryToSetValueToZero()`: Attempts to set the value to zero, but reverts if the value is already zero.
- `halveValue()`: Halves the current value if it is greater than 1.
- `incrementValue(uint256 increment)`: Increments the current value by a given amount if the increment is greater than zero.
- `decrementValue(uint256 decrement)`: Decrements the current value by a given amount if the decrement is valid and does not exceed the current value.

### Functions and Their Usage

- **getBalance()**:
  - Returns the current balance.

- **doubleValue()**:
  - Doubles the current value stored in the contract.
  - Asserts that the new value is greater than the old value to ensure no overflow.

- **tryToSetValueToZero()**:
  - Attempts to set the value to zero.
  - Reverts the transaction if the value is already zero.

- **halveValue()**:
  - Halves the current value.
  - Requires the current value to be greater than 1 to ensure halving is meaningful.

- **incrementValue(uint256 increment)**:
  - Increments the current value by the specified `increment`.
  - Requires `increment` to be greater than 0.
  - Asserts that the new value is correctly incremented and no overflow occurs.

- **decrementValue(uint256 decrement)**:
  - Decrements the current value by the specified `decrement`.
  - Requires `decrement` to be greater than 0.
  - Requires the current value to be at least as large as `decrement` to avoid underflow.

 ## Assesment.sol

```// SPDX-License-Identifier: UNLICENSED
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
```
## index.js

```import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBigNumber = await atm.getBalance();
      const balanceInEth = ethers.utils.formatEther(balanceBigNumber);
      setBalance(balanceInEth);
    }
  };

  const handleDoubleValue = async () => {
    if (atm) {
      const transaction = await atm.doubleValue();
      await transaction.wait();
      getBalance();
    }
  };

  const handleHalveValue = async () => {
    if (atm) {
      const transaction = await atm.halveValue();
      await transaction.wait();
      getBalance();
    }
  };

  const handleIncrementValue = async () => {
    if (atm) {
      const amountInWei = ethers.utils.parseUnits(amount, "ether");
      const transaction = await atm.incrementValue(amountInWei);
      await transaction.wait();
      getBalance();
    }
  };

  const handleDecrementValue = async () => {
    if (atm) {
      const amountInWei = ethers.utils.parseUnits(amount, "ether");
      const transaction = await atm.decrementValue(amountInWei);
      await transaction.wait();
      getBalance();
    }
  };

  const handleTryToSetValueToZero = async () => {
    if (atm) {
      const transaction = await atm.tryToSetValueToZero();
      await transaction.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button className="btn" onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p>
          <strong>Account:</strong> {account}
        </p>
        <p>
          <strong>Balance:</strong> {balance} ETH
        </p>
        <form className="form">
          <label>Enter amount:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </form>
        <div className="buttons">
          <button className="btn" onClick={handleIncrementValue}>
            Increment {amount} ETH
          </button>
          <button className="btn" onClick={handleDecrementValue}>
            Decrement {amount} ETH
          </button>
          <button className="btn" onClick={handleDoubleValue}>
            Double Value
          </button>
          <button className="btn" onClick={handleHalveValue}>
            Halve Value
          </button>
          <button className="btn" onClick={handleTryToSetValueToZero}>
            Set Value to Zero
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Ethereum Defi Bank</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        header {
          background-color: #282c34;
          width: 100%;
          padding: 20px;
          color: white;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .user-info {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        .form {
          margin: 20px 0;
        }
        .form label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .buttons {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }
        .btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          flex-grow: 1;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </main>
  );
}
```



