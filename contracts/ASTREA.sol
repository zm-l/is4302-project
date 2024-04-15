// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./KarmaToken.sol";

contract ASTREA {
    // Refer IV C.System Description
    // To consider: Do we want to dynamically set these values based on bountyAmount?
    uint256 public constant MAX_VOTING_STAKE = 100;
    uint256 public constant MIN_CERTIFYING_STAKE = 100;
    uint256 public constant DECISION_THRESHOLD = 1000;

    enum Outcomes { True, False, Undecided }
    // Token contract
    KarmaToken karmaTokenContract;

    struct Proposition {
        string tweetURL;
        // A mapping of outcome (true or false) to the total voting stake for that outcome
        mapping(bool=>uint256) votingStake;
        mapping(bool => uint256) certifyingStake;
        bool decided;
        // 3 possible states: true, false, undecided
        Outcomes trueOutcome;
        // To be decided by the like count of the tweet?
        uint256 bountyAmount; // reward for voting
        uint256 rewardPool; // reward for certifying
    }
    Proposition[] public propositions;

    struct Player {
        // A mapping from proposition index to the player's voting stake
        mapping(uint256 => mapping(bool => uint256)) votingStakes;
        mapping(uint256 => mapping(bool => uint256)) certifyingStakes;
    }
    address[] public playerAddresses;
    mapping(address => Player) private players;

    constructor(uint256 initialSupply) {
        karmaTokenContract = new KarmaToken("KarmaToken", "KarmaToken", initialSupply);
    }

    function getKarmaToken(uint256 _amount) public {
        karmaTokenContract.mint(msg.sender, _amount);
    }

    function addProposition(string memory _tweetURL, uint256 _bountyAmount, uint256 _rewardPool) public {
        Proposition storage newProposition = propositions.push();
        newProposition.tweetURL = _tweetURL;
        newProposition.bountyAmount = _bountyAmount;
        newProposition.rewardPool = _rewardPool;
    }

    function getRandomProposition() public view returns (uint256) {
        uint256 randomProposition = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    blockhash(block.number - 1) // Use previous block's hash for additional randomness
                )
            )
        ) % propositions.length;

        return randomProposition;
    }   

    function addPlayer(address _playerAddress) public {
        require(!isPlayerRegistered(_playerAddress), "Player is already registered");
        playerAddresses.push(_playerAddress);
    }

    function isPlayerRegistered(address playerAddress) internal view returns (bool) {
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            if (playerAddresses[i] == playerAddress) {
                return true;
            }
        }
        return false;
    }

    function getPlayerVotingStakes(address playerAddress, uint256 propositionIndex) public view returns (uint256[] memory) {
        uint256[] memory votingStakes = new uint256[](2); // 2 because there are two possible outcomes (true and false)
        votingStakes[0] = players[playerAddress].votingStakes[propositionIndex][true];
        votingStakes[1] = players[playerAddress].votingStakes[propositionIndex][false];
        return votingStakes;
    }

    function getPlayerCertifyingStakes(address playerAddress, uint256 propositionIndex) public view returns (uint256[] memory) {
        uint256[] memory certifyingStakes = new uint256[](2); // 2 because there are two possible outcomes (true and false)
        certifyingStakes[0] = players[playerAddress].certifyingStakes[propositionIndex][true];
        certifyingStakes[1] = players[playerAddress].certifyingStakes[propositionIndex][false];
        return certifyingStakes;
    }

    function voteOnProposition(uint256 _propositionIndex, bool _vote, uint256 _stake) public {
        require(isPlayerRegistered(msg.sender), "Player is not registered");
        require(_stake <= karmaTokenContract.balanceOf(msg.sender), "Insufficient KarmaTokens to vote.");
        require(_stake <= MAX_VOTING_STAKE, "Voting stake exceeds the maximum.");
        require(!propositions[_propositionIndex].decided, "Proposition has already been decided.");

        karmaTokenContract.burn(msg.sender, _stake);
        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update voting stakes
        proposition.votingStake[_vote] += _stake;
        player.votingStakes[_propositionIndex][_vote] += _stake;

        // Check if proposition has been decided
        if (proposition.votingStake[true] >= DECISION_THRESHOLD || proposition.votingStake[false] >= DECISION_THRESHOLD) {
            proposition.decided = true;

            if (proposition.votingStake[true] > proposition.votingStake[false] && proposition.certifyingStake[true] > proposition.certifyingStake[false]) {
                proposition.trueOutcome = Outcomes.True;
            } else if (proposition.votingStake[false] > proposition.votingStake[true] && proposition.certifyingStake[false] > proposition.certifyingStake[true]){
                proposition.trueOutcome = Outcomes.False;
            } else {
                proposition.trueOutcome = Outcomes.Undecided;
            }

            distributeVotingRewards(_propositionIndex, proposition.trueOutcome);
            distributeCertifierRewards(_propositionIndex, proposition.trueOutcome);
        }
    }

    function certifyProposition(uint256 _propositionIndex, bool _certification, uint256 _stake) public {
        require(isPlayerRegistered(msg.sender), "Player is not registered");
        require(_stake <= karmaTokenContract.balanceOf(msg.sender), "Insufficient KarmaTokens to vote.");
        require(_stake >= MIN_CERTIFYING_STAKE, "Certifying stake is below the minimum.");
        require(!propositions[_propositionIndex].decided, "Proposition has already been decided.");

        karmaTokenContract.burn(msg.sender, _stake);
        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update certifying stakes
        proposition.certifyingStake[_certification] += _stake;
        player.certifyingStakes[_propositionIndex][_certification] += _stake;
    }

    function distributeVotingRewards(uint256 _propositionIndex, Outcomes _trueOutcome) private {
        Proposition storage proposition = propositions[_propositionIndex];
        uint256 totalCorrectVotingStake;
        if (_trueOutcome == Outcomes.True) {
            totalCorrectVotingStake = proposition.votingStake[true];
        } else {
            totalCorrectVotingStake = proposition.votingStake[false];
        }
        uint256 bountyAmount = propositions[_propositionIndex].bountyAmount;

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            Player storage player = players[playerAddress];
            uint256 votingReward = 0;
            if (_trueOutcome == Outcomes.True) {
                votingReward = player.votingStakes[_propositionIndex][true] * bountyAmount / totalCorrectVotingStake + player.votingStakes[_propositionIndex][true];
            } else if (_trueOutcome == Outcomes.False){
                votingReward = player.votingStakes[_propositionIndex][false] * bountyAmount / totalCorrectVotingStake + player.votingStakes[_propositionIndex][false];
            } else {
                votingReward = player.votingStakes[_propositionIndex][true] + player.votingStakes[_propositionIndex][false];
            }
            karmaTokenContract.mint(playerAddress, votingReward);
        }
    }

    function distributeCertifierRewards(uint256 _propositionIndex, Outcomes _trueOutcome) private {
        Proposition storage proposition = propositions[_propositionIndex];
        uint256 totalCorrectCertifyingStake;
        if (_trueOutcome == Outcomes.True) {
            totalCorrectCertifyingStake = proposition.votingStake[true];
        } else {
            totalCorrectCertifyingStake = proposition.votingStake[false];
        }
        uint256 rewardPoolAmount = proposition.rewardPool; 

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            Player storage player = players[playerAddress];
            if (_trueOutcome == Outcomes.True) {
                uint256 certifierReward = player.certifyingStakes[_propositionIndex][true] * rewardPoolAmount / totalCorrectCertifyingStake;
                karmaTokenContract.mint(playerAddress, certifierReward);
            } else if (_trueOutcome == Outcomes.False) {
                uint256 certifierReward = player.certifyingStakes[_propositionIndex][false] * rewardPoolAmount / totalCorrectCertifyingStake;
                karmaTokenContract.mint(playerAddress, certifierReward);
            }
        }
    }
}