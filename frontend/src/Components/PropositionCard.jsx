import React, { useState } from "react";
import { Tweet } from "react-tweet";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

const PropositionCard = ({ proposition }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} marginBottom={4}>
      <Tweet id={proposition.tweetURL.split("/")[5]} />
      <Text fontSize="lg" fontWeight="bold">
        Tweet URL:
      </Text>
      <Text>{proposition.tweetURL}</Text>
      <Button onClick={handleExpand} marginTop={2} size="sm">
        {expanded ? "Collapse" : "Expand"}
      </Button>
      {expanded && (
        <VStack align="start" marginTop={4}>
          {proposition.decided && (
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Voting Stake:
              </Text>
              <Text>True: {proposition.votingStakeTrue.toString()}</Text>
              <Text>False: {proposition.votingStakeFalse.toString()}</Text>

              <Text fontSize="lg" fontWeight="bold">
                Certifying Stake:
              </Text>
              <Text>True: {proposition.certifyingStakeTrue.toString()}</Text>
              <Text>False: {proposition.certifyingStakeFalse.toString()}</Text>
              <Text fontSize="lg" fontWeight="bold">
                Outcome:
              </Text>
              <Text>
                {proposition.trueOutcome === 0
                  ? "True"
                  : proposition.trueOutcome === 1
                  ? "False"
                  : "Undecided"}
              </Text>
            </Box>
          )}

          <Text fontSize="lg" fontWeight="bold">
            Bounty Amount:
          </Text>
          <Text>{proposition.bountyAmount.toString()}</Text>

          <Text fontSize="lg" fontWeight="bold">
            Reward Pool:
          </Text>
          <Text>{proposition.rewardPool.toString()}</Text>
        </VStack>
      )}
    </Box>
  );
};

export default PropositionCard;
