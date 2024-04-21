import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { contractAddress, contractAbi } from "../Constant/constant";

const CertifyPopup = ({ isOpen, onClose, selectedPropositionIndex }) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCertify = async (certification) => {
    try {
      // Convert the stake amount to a number
      const stakeAmountNumber = parseFloat(stakeAmount);

      // Check if the stake amount is valid
      if (isNaN(stakeAmountNumber) || stakeAmountNumber <= 0) {
        // Display an error message or handle invalid stake amount
        setErrorMessage("Invalid stake amount");
        return;
      }

      const minCertifyingStake = await getMinCertifyingStake();
      console.log("Minimum certifying stake:", minCertifyingStake);
      if (stakeAmountNumber < minCertifyingStake) {
        // Display an error message or handle invalid stake amount
        setErrorMessage(
          "The stake amount is below the minimum required, which is " +
            minCertifyingStake
        );
        return;
      }

      // Call the certifyProposition function with the selectedPropositionIndex and stakeAmount
      console.log("Certifying proposition:", selectedPropositionIndex);
      await certifyProposition(
        selectedPropositionIndex,
        certification,
        stakeAmountNumber
      );

      // Close the modal after certifying
      onClose();
    } catch (error) {
      // Handle errors, such as displaying an error message to the user
      console.error("Error certifying proposition:", error);
    }
  };

  const getMinCertifyingStake = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const minCertifyinStake = await contract.MIN_CERTIFYING_STAKE();
      return minCertifyinStake;
    } catch (error) {
      console.error("Error getting min certifying stake:", error);
    }
  };

  const certifyProposition = async (
    propositionIndex,
    certification,
    stakeAmount
  ) => {
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

      // You need to adjust the function signature according to your contract
      const tx = await contract.certifyProposition(
        propositionIndex,
        certification,
        stakeAmount,
        overrides
      );
      await tx.wait();

      console.log("Proposition certified successfully");
    } catch (error) {
      console.error("Error certifying proposition:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Certify Tweet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errorMessage !== ""}>
            <Input
              placeholder="Enter stake amount"
              value={stakeAmount}
              onChange={(e) => {
                setStakeAmount(e.target.value);
                // Clear the error message when the stake amount changes
                setErrorMessage("");
              }}
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleCertify(true)}>
            True
          </Button>
          <Button colorScheme="red" mr={3} onClick={() => handleCertify(false)}>
            False
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CertifyPopup;
