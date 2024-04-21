import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  Button,
  useToast,
  Center,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { contractAddress, contractAbi } from "../Constant/constant";

function Register() {
  const { account } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAbove18, setIsAbove18] = React.useState(false);
  const INITIAL_KARMA = 1000;
  const toast = useToast();
  const navigate = useNavigate();

  async function addPlayer() {
    if (account) {
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

        const tx = await contract.addPlayer(account, overrides);
        await tx.wait();

        const giveKarmaToken = await contract.getKarmaToken(
          INITIAL_KARMA,
          overrides
        );
        await giveKarmaToken.wait();

        console.log("Added player");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Implement logic to handle user registration
    // This could involve making an API call to a backend server
    // or interacting with a smart contract

    // Example validation (replace with more robust validation)
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (!isAbove18) {
      toast({
        title: "Error",
        description: "You must be above 18 to register",
        status: "error",
        isClosable: true,
      });
      return;
    }

    await addPlayer();
    navigate("/home");
  };

  const handleCheckboxChange = (event) => {
    setIsAbove18(event.target.checked);
  };

  return (
    <Box
      className="register-form"
      width="full"
      p={4}
      minH="100vh"
      bg="orange.300"
    >
      <NavBar />
      <Center>
        <VStack spacing={4}>
          <Heading as="h2" size="lg" textAlign="center" mb={6}>
            Register
          </Heading>
          <FormControl isInvalid={password !== confirmPassword}>
            <FormLabel htmlFor="username">Username:</FormLabel>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormControl>
          <FormControl isInvalid={password !== confirmPassword}>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl isInvalid={password !== confirmPassword}>
            <FormLabel htmlFor="password">Password:</FormLabel>
            <InputGroup size="md">
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <FormHelperText
              display={password !== confirmPassword ? "block" : "none"}
            >
              Passwords do not match
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={password !== confirmPassword}>
            <FormLabel htmlFor="confirm-password">Confirm Password:</FormLabel>
            <Input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormControl>
          <CheckboxGroup display="flex" alignItems="center">
            <Checkbox isChecked={isAbove18} onChange={handleCheckboxChange}>
              <FormLabel htmlFor="isAbove18">
                I acknowledge that I am above the age of 18.
              </FormLabel>
            </Checkbox>
          </CheckboxGroup>
          <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
            Register
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default Register;
