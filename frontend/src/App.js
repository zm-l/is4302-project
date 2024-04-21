import React from "react";
import { AuthProvider } from "./Contexts/AuthContext";

import AppRouter from "./pages/AppRouter";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <AuthProvider>
      <ChakraProvider>
        <AppRouter />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
