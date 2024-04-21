import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

import Login from "./Login.jsx";
import MyAccount from "./MyAccount.jsx";
import AddProposition from "./AddProposition.jsx";
import Home from "./Home.jsx";
import VoteProposition from "./VoteProposition.jsx";
import Register from "./Register.jsx";

function AppRouter() {
  const { account } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Protected route, only accessible when authenticated */}
        <Route
          path="/home"
          element={account ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={account ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/account"
          element={account ? <MyAccount /> : <Navigate to="/" />}
        />
        <Route
          path="/add"
          element={account ? <AddProposition /> : <Navigate to="/" />}
        />
        <Route
          path="/vote"
          element={account ? <VoteProposition /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
