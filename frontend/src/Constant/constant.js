<<<<<<< Updated upstream
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
=======
const contractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
>>>>>>> Stashed changes

const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "tweetURL",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bountyAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rewardPool",
        "type": "uint256"
      }
    ],
    "name": "PropositionAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DECISION_THRESHOLD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_VOTING_STAKE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_CERTIFYING_STAKE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_playerAddress",
        "type": "address"
      }
    ],
    "name": "addPlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tweetURL",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_bountyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardPool",
        "type": "uint256"
      }
    ],
    "name": "addProposition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_propositionIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_certification",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "name": "certifyProposition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "getKarmaToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getKarmaTokenBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "propositionIndex",
        "type": "uint256"
      }
    ],
    "name": "getPlayerCertifyingStakes",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "propositionIndex",
        "type": "uint256"
      }
    ],
    "name": "getPlayerVotingStakes",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPropositionLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "name": "getRandomProposition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      }
    ],
    "name": "isPlayerRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "playerAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "propositions",
    "outputs": [
      {
        "internalType": "string",
        "name": "tweetURL",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votingStakeTrue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "votingStakeFalse",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "certifyingStakeTrue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "certifyingStakeFalse",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "decided",
        "type": "bool"
      },
      {
        "internalType": "enum ASTRAEA.Outcomes",
        "name": "trueOutcome",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "bountyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardPool",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_propositionIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_vote",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "name": "voteOnProposition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export { contractAddress, contractAbi };
