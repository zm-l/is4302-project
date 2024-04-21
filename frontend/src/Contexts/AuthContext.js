import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({ account: null, setAccount: () => {} });

export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Check for MetaMask on initial render and window.ethereum changes
    const checkMetaMask = async () => {
      if (window.ethereum) {
        try {
          // Check if accounts are already connected
          const connectedAccounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (connectedAccounts.length > 0) {
            setAccount(connectedAccounts[0]); // Set initial account if connected
          }
          // Add event listener for account changes
          window.ethereum.on("accountsChanged", handleAccountChange);
        } catch (err) {
          console.error("Error checking MetaMask:", err);
        }
      }
    };

    checkMetaMask();
  }); // Dependency on window.ethereum for re-check

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]); // Update account on change
    } else {
      setAccount(null); // Clear account if disconnected
    }
  };

  const connectToMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ account, setAccount, connectToMetaMask }}>
      {children}
    </AuthContext.Provider>
  );
};
