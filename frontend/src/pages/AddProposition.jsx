import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import { contractAbi, contractAddress } from "../Constant/constant";
import NavBar from "../Components/NavBar";

function AddProposition() {
  const [proposition, setProposition] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTweetData = async (tweetId) => {
    try {
      // Make a request to your server's endpoint
      const response = await fetch(
        `http://localhost:5000/api/get-tweet?id=${tweetId}`
      );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to fetch tweet data");
      }

      // Parse the response JSON
      const data = await response.json();
      return data.favorite_count;
    } catch (error) {
      console.error("Error fetching tweet data:", error);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(""); // Clear any previous errors

    if (!proposition || !bountyAmount) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const likeCount = await fetchTweetData(proposition.split("/")[5]);
      console.log("Like count:", likeCount);
      await addProposition(proposition, bountyAmount, likeCount);
      setProposition(""); // Clear input fields after successful submission
      setBountyAmount("");
    } catch (error) {
      console.error("Error adding proposition:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
    }
  };

  async function addProposition(tweetURL, bountyAmount, rewardPool) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const overrides = {
        gasLimit: 5000000,
      };

      // Set up event listener for PropositionAdded
      contractInstance.on(
        "PropositionAdded",
        (tweetURL, bountyAmount, rewardPool) => {
          console.log("Proposition added:", tweetURL, bountyAmount, rewardPool);
        }
      );

      const tx = await contractInstance.addProposition(
        tweetURL,
        bountyAmount,
        rewardPool,
        overrides
      );

      console.log("Transaction Hash:", tx);
      const receipt = await tx.wait(); // Wait for transaction confirmation
      console.log("Transaction Confirmed:", receipt);
    } catch (error) {
      console.error("Error adding proposition:", error);
    }
  }

  return (
    <Box minH="100vh" bg="orange.300" p={4}>
      <NavBar />
      <VStack py={8}>
        <Box textAlign="center" fontSize="xl" fontWeight="bold" mb={4}>
          Add Proposition
        </Box>
        <Box>
          <FormControl isInvalid={!!errorMessage}>
            <FormLabel htmlFor="proposition">Proposition</FormLabel>
            <Input
              id="proposition"
              value={proposition}
              onChange={(e) => setProposition(e.target.value)}
              placeholder="Enter your proposition"
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
          <FormControl mt={4} isInvalid={!!errorMessage}>
            <FormLabel htmlFor="bountyAmount">
              Bounty Amount (Karma Token)
            </FormLabel>
            <Input
              id="bountyAmount"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              placeholder="Enter bounty amount"
              type="number"
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
          <Box>
            <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
              Submit Proposition
            </Button>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

export default AddProposition;
