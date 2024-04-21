import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAuth } from "../Contexts/AuthContext";
import NavBar from "../Components/NavBar";
import { Box, Center, Text, Button } from "@chakra-ui/react";
import { contractAddress, contractAbi } from "../Constant/constant";
import CertifyPopup from "../Components/CertifyPopup";
import PropositionCard from "../Components/PropositionCard";

function Home() {
  const { account } = useAuth();
  const [propositions, setPropositions] = useState([]);
  const [selectedPropositionIndex, setSelectedPropositionIndex] =
    useState(null);
  const [isCertifyPopupOpen, setIsCertifyPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPropositions = async () => {
      if (account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );

          const propositionsCount = await contract.getPropositionLength();

          const fetchedPropositions = [];

          for (let i = 0; i < propositionsCount; i++) {
            const proposition = await contract.propositions(i);
            console.log("Proposition:", proposition);
            fetchedPropositions.push(proposition);
          }

          setPropositions(fetchedPropositions);
        } catch (error) {
          console.error("Error fetching propositions:", error);
        }
      }
    };

    fetchPropositions();
  });

  return (
    <Box minH="100vh" bg="orange.300" p={4}>
      <NavBar />
      <Center>
        {propositions.length > 0 && (
          <ul>
            {propositions.map((proposition, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <Text fontSize="2xl" mb="2">
                  Proposition {index + 1}:
                </Text>
                <PropositionCard proposition={proposition} />
                {!Boolean(proposition.decided) && (
                  <Button
                    onClick={() => {
                      setSelectedPropositionIndex(index);
                      setIsCertifyPopupOpen(true);
                    }}
                    disabled={Boolean(proposition.decided)}
                  >
                    Certify Tweet
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Center>
      <CertifyPopup
        isOpen={isCertifyPopupOpen}
        onClose={() => setIsCertifyPopupOpen(false)}
        selectedPropositionIndex={selectedPropositionIndex}
      />
    </Box>
  );
}

export default Home;
