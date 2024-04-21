import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../Constant/constant";
import { Tweet } from "react-tweet";

import {
  Box,
  Heading,
  Button,
  Input,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Center,
  VStack,
} from "@chakra-ui/react";
import NavBar from "../Components/NavBar";

const VoteProposition = () => {
  const [propositionIndex, setPropositionIndex] = useState(null);
  const [proposition, setProposition] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [voteValue, setVoteValue] = useState("true");
  const [errorMessage, setErrorMessage] = useState("");

  const getRandomProposition = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const overrides = {
        gasLimit: 5000000,
      };

      // Convert the stake amount to a number
      const stakeAmountNumber = parseFloat(stakeAmount);

      // Check if the stake amount is valid
      if (isNaN(stakeAmountNumber) || stakeAmountNumber <= 0) {
        setErrorMessage("Invalid stake amount");
        return;
      }

      const maxVotingStake = await contract.MAX_VOTING_STAKE();

      console.log("Maximum voting stake:", maxVotingStake.toNumber());
      if (stakeAmountNumber > maxVotingStake.toNumber()) {
        // Display an error message or handle invalid stake amount
        setErrorMessage(
          "The stake amount is above the maximum allowed, which is " +
            maxVotingStake.toNumber()
        );
        return;
      }

      const randomPropositionIndex = await contract.getRandomProposition(
        stakeAmountNumber,
        overrides
      );
      console.log(
        "Random proposition index:",
        randomPropositionIndex.value.toNumber()
      );
      setPropositionIndex(randomPropositionIndex.value.toString());
      const proposition = await contract.propositions(
        randomPropositionIndex.value
      );
      console.log(proposition);
      setProposition(proposition);
    } catch (error) {
      console.error("Error getting random proposition:", error);
    }
  };

  const voteOnProposition = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const overrides = {
        gasLimit: 5000000,
      };

      // Vote on the proposition
      const tx = await contract.voteOnProposition(
        propositionIndex,
        voteValue,
        stakeAmount,
        overrides
      );
      await tx.wait();

      console.log("Vote submitted successfully");
      setPropositionIndex(null);
      setProposition(null);
      setStakeAmount("");
      setVoteValue("true");
    } catch (error) {
      console.error("Error voting on proposition:", error);
    }
  };

  return (
    <Box minH="100vh" bg="orange.300" p={4}>
      <NavBar />
      <Center>
        <VStack>
          <Heading mb={6}>Vote on a Proposition</Heading>
          {!propositionIndex && (
            <Box>
              <Input
                placeholder="Enter stake amount"
                value={stakeAmount}
                onChange={(e) => {
                  setStakeAmount(e.target.value);
                  setErrorMessage("");
                }}
                mb={4}
              />
              {errorMessage && <Text color="red.500">{errorMessage}</Text>}
              <Button colorScheme="blue" onClick={getRandomProposition}>
                Get Random Proposition
              </Button>
            </Box>
          )}
          {propositionIndex !== null && (
            <Box>
              <Text mb={4}>Proposition: {Number(propositionIndex) + 1}</Text>
              {proposition != null && (
                <Tweet id={proposition.tweetURL.split("/")[5]} />
              )}
              <RadioGroup value={voteValue} onChange={setVoteValue} mb={4}>
                <Stack direction="row">
                  <Radio value={"true"} colorScheme="green">
                    True
                  </Radio>
                  <Radio value={"false"} colorScheme="red">
                    False
                  </Radio>
                </Stack>
              </RadioGroup>
              <Button colorScheme="blue" onClick={voteOnProposition}>
                Vote
              </Button>
            </Box>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default VoteProposition;
