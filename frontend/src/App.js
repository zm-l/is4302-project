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
  const handleConnect = async () => {

    createUser();
  };

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
      <select name="userType" value={userType} onChange={event => handleUserTypeChange(event.target.value)}>
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
      await KarmaTokenContract.mint(walletAddress, ethers.BigNumber.from(amount).toString());
    }

    return (
      <>
        <label>Enter amount of ether to trade for KarmaToken:</label>
        <input type='number' onChange={handleAmountChange} />
        <button onClick={handleButton}>Obtain Karma Token</button>
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
        <label>Karma Tokens</label>
        <label>{balance}</label>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Enter proposition: </label>
        <input
          type="text"
          value={proposition}
          onChange={handleChange}
          style={{ width: "300px" }}
        />
        <button onClick={handleAddProposition}>Add Proposition</button>
      </div>
    )
  }

  return (
    <div className="App">

      <h1>TwitterX</h1>
      <button onClick={handleConnect}> Connect MetaMask</button>

      <div>Wallet Address: {walletAddress} </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        &nbsp;
        <UserTypeSelector />
        &nbsp;
        <ObtainTokenButton />
        &nbsp;
        <KarmaTokenBalance />
        &nbsp;
        <AddProposition />
      </div>
      &nbsp;
      <div>
        <VoteProposition />
        <CertifyProposition />
      </div>
    </div >
  );
};

export default App;