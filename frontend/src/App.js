import './App.css';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import VoteProposition from './components/VoteProposition';
import CertifyProposition from './components/CertifyProposition';

import { KARMA_TOKEN_ABI, KARMA_TOKEN_ADDRESS, USER_CONTRACT_ABI, USER_CONTRACT_ADDRESS } from './services';

const App = () => {
  const [walletAddress, setWalletAddress] = useState();
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request(
        { method: 'eth_requestAccounts' });
      setWalletAddress(account);
    }
  }
  useEffect(() => {
    connectWallet();
  }, []);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const UserSol = new ethers.Contract(USER_CONTRACT_ADDRESS, USER_CONTRACT_ABI, provider);
  const UserContract = UserSol.connect(signer);

  const KarmaToken = new ethers.Contract(KARMA_TOKEN_ADDRESS, KARMA_TOKEN_ABI, provider);
  const KarmaTokenContract = KarmaToken.connect(signer);

  const createUser = async () => {
    const res = await UserContract.isValidUser();
    if (!res) {
      await UserContract.createUser("testUsername");
      console.log("User created");
    }
  }

  const UserTypeSelector = () => {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = async (userType) => {
      setUserType(userType);
      await UserContract.updateUser(userType);
      console.log("User Type changed to " + userType);
    }

    return (
      <select className="userTypeSelect" value={userType} onChange={event => handleUserTypeChange(event.target.value)}>
        <option id="1">Voter</option>
        <option id="2">Certifier</option>
      </select>
    )
  }

  const ObtainTokenButton = () => {
    const [amount, setAmount] = useState(0);

    const handleAmountChange = (event) => {
      setAmount(event.target.value);
    }

    const handleButton = async () => {
      if (amount === 0) {
        return;
      }
      await KarmaTokenContract.mint(walletAddress, ethers.BigNumber.from(amount).toString());
    }

    return (
      <>
        <label className="tokenLabel">Enter amount of ether to trade for KarmaToken:</label>
        <input type='number' onChange={handleAmountChange} />
        <button className="tokenButton" onClick={handleButton}>Obtain Karma Token</button>
      </>
    )
  }

  const KarmaTokenBalance = () => {
    const [balance, setBalance] = useState(0);
    const getBalance = async () => {
      if (walletAddress != null) {
        const res = await KarmaToken.balanceOf(walletAddress);
        setBalance(res.toString());
      }
    }

    useEffect(() => {
      getBalance();
    }, []);

    return (
      <>
        <label className="balanceLabel">Karma Tokens</label>
        <label className="balanceValue">{balance}</label>
      </>
    )
  }

  const AddProposition = () => {
    const [proposition, setProposition] = useState('');

    const handleChange = (event) => {
      setProposition(event.target.value);
    }

    const handleAddProposition = () => {
      console.log("Proposition: " + proposition);
      setProposition("");
    }

    return (
      <div className="addPropositionContainer">
        <label className="propositionLabel">Enter proposition:</label>
        <input
          type="text"
          value={proposition}
          onChange={handleChange}
          className="propositionInput"
        />
        <button className="addPropositionButton" onClick={handleAddProposition}>Add Proposition</button>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TwitterX</h1>
        <button className="connectButton" onClick={createUser}>Connect MetaMask</button>
        <div className="walletAddress">Wallet Address: {walletAddress} </div>
      </header>
      <main className="App-main">
        <div className="userInteractionContainer">
          <UserTypeSelector />
          <ObtainTokenButton />
          <KarmaTokenBalance />
          <AddProposition />
        </div>
        <div className="propositionsContainer">
          <VoteProposition />
          <CertifyProposition />
        </div>
      </main>
    </div>
  );
};

export default App;
