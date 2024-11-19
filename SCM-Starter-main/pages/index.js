import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import Logo from "./../m-logo.png"; // Import your logo file

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [conversionPrice, setConversionPrice] = useState(113472.95);
  const [convertedBalance, setConvertedBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
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

    const accounts = await ethWallet.request({
      method: "eth_requestAccounts",
    });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(
      contractAddress,
      atmABI,
      signer
    );

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const rawBalance = await atm.getBalance();
      setBalance(rawBalance.toNumber());
      convertToPHP(rawBalance.toNumber());
    }
  };

  const convertToPHP = (ethBalance) => {
    const phpBalance = (ethBalance * conversionPrice).toFixed(2);
    setConvertedBalance(phpBalance);
  };

  const getConversionPrice = () => {
    setConversionPrice(113472.95);
  };

  const handleDepositAmountChange = (event) => {
    setDepositAmount(event.target.value);
  };

  const handleWithdrawAmountChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  const deposit = async () => {
    if (atm && depositAmount > 0) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
      setDepositAmount(""); 
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmount > 0) {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
      setWithdrawAmount(""); 
    }
  };

  const initUser = () => {
    // Check to see if the user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <p>Conversion Price: ${conversionPrice} for 1 ETH</p>
        <p>Converted Balance: {convertedBalance} PHP</p>
        <div>
          <label htmlFor="depositAmount">Deposit Amount:</label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={handleDepositAmountChange}
          />
          <button onClick={deposit}>Deposit</button>
        </div>
        <div>
          <label htmlFor="withdrawAmount">Withdraw Amount:</label>
          <input
            type="number"
            id="withdrawAmount"
            value={withdrawAmount}
            onChange={handleWithdrawAmountChange}
          />
          <button onClick={withdraw}>Withdraw</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    getConversionPrice(); // Fetch the conversion price on component mount
  }, []);

  return (
    <main className="container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <header>
          <h1>Welcome to the Metacrafters ATM!</h1>
        </header>
        {initUser()}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          text-align: center;
        }

        .logo-container {
          flex: 1;
        }

        .logo {
          width: 100px; /* Adjust the width as needed */
        }

        .content-container {
          flex: 2;
          text-align: left;
          padding: 20px;
        }
      `}</style>
    </main>
  );
}
