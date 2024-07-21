import { useState, useEffect } from "react";
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
