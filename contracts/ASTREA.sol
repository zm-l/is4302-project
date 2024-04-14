// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Tweet.sol";

contract ASTREA {
    // Refer IV C.System Description
    // To consider: Do we want to dynamically set these values based on bountyAmount?
    uint256 public constant MAX_VOTING_STAKE = 100;
    uint256 public constant MIN_CERTIFYING_STAKE = 100;
    uint256 public constant DECISION_THRESHOLD = 1000;

    struct Proposition {
        // A mapping of outcome (true or false) to the total voting stake for that outcome
        mapping(bool=>uint256) votingStake;
        mapping(bool => uint256) certifyingStake;
        bool decided;
        bool trueOutcome;
        Tweet tweet;
        uint256 bountyAmount; // To be decided by the like count of the tweet?
    }
    Proposition[] public propositions;

    struct Player {
        // A mapping from proposition index to the player's voting stake
        mapping(uint256 => mapping(bool => uint256)) votingStakes;
        mapping(uint256 => mapping(bool => uint256)) certifyingStakes;
    }
    address[] public playerAddresses;
    mapping(address => Player) private players;

    // Reward pools
    uint256 public trueCertifierRewardPool;
    uint256 public falseCertifierRewardPool;

    function voteOnProposition(uint256 _propositionIndex, bool _vote, uint256 _stake) public {
        require(_stake <= MAX_VOTING_STAKE, "Voting stake exceeds the maximum.");
        require(!propositions[_propositionIndex].decided, "Proposition has already been decided.");

        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update voting stakes
        proposition.votingStake[_vote] += _stake;
        player.votingStakes[_propositionIndex][_vote] += _stake;

        // Check if proposition has been decided
        if (proposition.votingStake[true] >= DECISION_THRESHOLD || proposition.votingStake[false] >= DECISION_THRESHOLD) {
            proposition.decided = true;
            proposition.trueOutcome = proposition.votingStake[true] > proposition.votingStake[false];
            distributeVotingRewards(_propositionIndex, proposition.trueOutcome);
        }
    }

    function certifyProposition(uint256 _propositionIndex, bool _certification, uint256 _stake) public {
        require(_stake >= MIN_CERTIFYING_STAKE, "Certifying stake is below the minimum.");
        require(!propositions[_propositionIndex].decided, "Proposition has already been decided.");

        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update certifying stakes
        proposition.certifyingStake[_certification] += _stake;
        player.certifyingStakes[_propositionIndex][_certification] += _stake;

        // Distribute certifier rewards
        distributeOracleCertifierRewards(_propositionIndex, _certification);
    }

    function distributeVotingRewards(uint256 _propositionIndex, bool _trueOutcome) private {
        Proposition storage proposition = propositions[_propositionIndex];
        uint256 totalVotingStake = proposition.votingStake[true] + proposition.votingStake[false];
        uint256 bountyAmount = propositions[_propositionIndex].bountyAmount;

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            Player storage player = players[playerAddress];
            if (_trueOutcome) {
                player.votingStakes[_propositionIndex][true] * bountyAmount / totalVotingStake;
            } else {
                player.votingStakes[_propositionIndex][false] * bountyAmount / totalVotingStake;
            }
        }
    }

    function distributeOracleCertifierRewards(uint256 _propositionIndex, bool _certification) private {
        Proposition storage proposition = propositions[_propositionIndex];
        uint256 totalCertifyingStake = proposition.certifyingStake[true] + proposition.certifyingStake[false];
        uint256 rewardPoolAmount = 1000; // Example reward pool amount
        uint256 certificationTarget = 10; // Example certification target

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            Player storage player = players[playerAddress];
            if (_certification) {
                player.certifyingStakes[_propositionIndex][true] * rewardPoolAmount / (totalCertifyingStake * certificationTarget);
            } else {
                player.certifyingStakes[_propositionIndex][false] * rewardPoolAmount / (totalCertifyingStake * certificationTarget);
            }
        }

        if (_certification == proposition.trueOutcome) {
            trueCertifierRewardPool += rewardPoolAmount;
        } else {
            falseCertifierRewardPool += rewardPoolAmount;
        }
    }
}