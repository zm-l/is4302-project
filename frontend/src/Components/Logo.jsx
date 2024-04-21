import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Logo(props) {
  const navigate = useNavigate();
  return (
    <Box {...props}>
      <Button onClick={() => navigate("/home")} variant="unstyled">
        <Text fontSize="lg" fontWeight="bold">
          VeriAstraea
        </Text>
      </Button>
    </Box>
  );
}
