import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { Button, Center, Text } from "@chakra-ui/react";

function Login({ error }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectToMetaMask } = useAuth();
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToMetaMask();
      navigate("/home");
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Center minH="100vh" bg="orange.300" py={8} px={4}>
      {error && (
        <Text color="red.500" textAlign="center" mb={4}>
          {error}
        </Text>
      )}
      {!isConnecting && (
        <Button
          colorScheme="orange"
          variant="solid"
          size="lg"
          isDisabled={!window.ethereum}
          onClick={handleConnect}
        >
          Connect to MetaMask
        </Button>
      )}
      {isConnecting && <Text color="gray.700">Connecting...</Text>}
    </Center>
  );
}

export default Login;
