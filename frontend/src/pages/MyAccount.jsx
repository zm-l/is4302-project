import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import NavBar from "../Components/NavBar";
import { Box, Heading, Text, Spinner, Center, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../Constant/constant";

function MyAccount() {
  const { account } = useAuth();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch balance using getKarmaTokenBalance (replace with your implementation)
  const fetchBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const fetchedBalance = await contractInstance.getKarmaTokenBalance();
      setBalance(fetchedBalance.toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [account]);

  return (
    <Box minH="100vh" bg="orange.300" p={4}>
      <NavBar />
      <Center>
        <VStack>
          <Heading as="h2" size="lg" mb={2}>
            My Account
          </Heading>
          <Text fontSize="l">Connected Account: {account}</Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <Text fontSize="xl">Karma Token Balance: {balance}</Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
}

export default MyAccount;
