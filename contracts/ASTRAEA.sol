// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./KarmaToken.sol";

contract ASTRAEA {
    // Refer IV C.System Description
    // To consider: Do we want to dynamically set these values based on bountyAmount?
    uint256 public constant MAX_VOTING_STAKE = 100;
    uint256 public constant MIN_CERTIFYING_STAKE = 100;
    uint256 public constant DECISION_THRESHOLD = 1000;

    enum Outcomes {
        True,
        False,
        Undecided
    }

    event PropositionAdded(
        string tweetURL,
        uint256 bountyAmount,
        uint256 rewardPool
    );

    event PlayerAdded();
    event KarmaTokensObtained();

    // Token contract
    KarmaToken karmaTokenContract;

    struct Proposition {
        string tweetURL;
        // A mapping of outcome (true or false) to the total voting stake for that outcome
        uint256 votingStakeTrue;
        uint256 votingStakeFalse;
        uint256 certifyingStakeTrue;
        uint256 certifyingStakeFalse;
        mapping(bool => uint256) votingStake;
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
        karmaTokenContract = new KarmaToken(
            "KarmaToken",
            "KarmaToken",
            initialSupply
        );
    }

    function getKarmaToken(uint256 _amount) public {
        karmaTokenContract.mint(msg.sender, _amount);

        emit KarmaTokensObtained();
    }

    function getKarmaTokenBalance() public view returns (uint256) {
        return karmaTokenContract.balanceOf(msg.sender);
    }

    function addProposition(
        string memory _tweetURL,
        uint256 _bountyAmount,
        uint256 _rewardPool
    ) public {
        require(
            _bountyAmount <= karmaTokenContract.balanceOf(msg.sender),
            "Insufficient KarmaTokens to provide as bounty"
        );
        karmaTokenContract.burn(msg.sender, _bountyAmount);

        Proposition storage newProposition = propositions.push();
        newProposition.tweetURL = _tweetURL;
        newProposition.bountyAmount = _bountyAmount;
        newProposition.rewardPool = _rewardPool;
        emit PropositionAdded(_tweetURL, _bountyAmount, _rewardPool);
    }

    function getPropositionLength() public view returns (uint256) {
        return propositions.length;
    }

    function getRandomProposition(uint256 _stake) public returns (uint256) {
        require(isPlayerRegistered(msg.sender), "Player is not registered");
        require(
            _stake <= karmaTokenContract.balanceOf(msg.sender),
            "Insufficient KarmaTokens to vote."
        );
        require(
            _stake <= MAX_VOTING_STAKE,
            "Voting stake exceeds the maximum."
        );
        require(propositions.length > 0, "No propositions available");

        // Find all the undecided proposition indices
        uint256[] memory undecidedIndices = new uint256[](propositions.length);
        uint256 undecidedCount;
        for (uint256 i = 0; i < propositions.length; i++) {
            if (!propositions[i].decided) {
                undecidedIndices[undecidedCount] = i;
                undecidedCount++;
            }
        }

        // If all propositions have been decided, return an error
        require(undecidedCount > 0, "All propositions have been decided");

        karmaTokenContract.burn(msg.sender, _stake);

        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    blockhash(block.number - 1) // Use previous block's hash for additional randomness
                )
            )
        ) % undecidedCount;

        return undecidedIndices[randomIndex];
    }

    function addPlayer(address _playerAddress) public {
        require(
            !isPlayerRegistered(_playerAddress),
            "Player is already registered"
        );
        playerAddresses.push(_playerAddress);

        emit PlayerAdded();
    }

    function isPlayerRegistered(
        address playerAddress
    ) public view returns (bool) {
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            if (playerAddresses[i] == playerAddress) {
                return true;
            }
        }
        return false;
    }

    function getPlayerVotingStakes(
        address playerAddress,
        uint256 propositionIndex
    ) public view returns (uint256[] memory) {
        uint256[] memory votingStakes = new uint256[](2); // 2 because there are two possible outcomes (true and false)
        votingStakes[0] = players[playerAddress].votingStakes[propositionIndex][
            true
        ];
        votingStakes[1] = players[playerAddress].votingStakes[propositionIndex][
            false
        ];
        return votingStakes;
    }

    function getPlayerCertifyingStakes(
        address playerAddress,
        uint256 propositionIndex
    ) public view returns (uint256[] memory) {
        uint256[] memory certifyingStakes = new uint256[](2); // 2 because there are two possible outcomes (true and false)
        certifyingStakes[0] = players[playerAddress].certifyingStakes[
            propositionIndex
        ][true];
        certifyingStakes[1] = players[playerAddress].certifyingStakes[
            propositionIndex
        ][false];
        return certifyingStakes;
    }

    function voteOnProposition(
        uint256 _propositionIndex,
        bool _vote,
        uint256 _stake
    ) public {
        require(isPlayerRegistered(msg.sender), "Player is not registered");
        require(
            _stake <= MAX_VOTING_STAKE,
            "Voting stake exceeds the maximum."
        );
        require(
            !propositions[_propositionIndex].decided,
            "Proposition has already been decided."
        );

        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update voting stakes
        if (_vote) {
            proposition.votingStakeTrue += _stake;
        } else {
            proposition.votingStakeFalse += _stake;
        }
        proposition.votingStake[_vote] += _stake;
        player.votingStakes[_propositionIndex][_vote] += _stake;

        // Check if proposition has been decided
        if (
            proposition.votingStake[true] >= DECISION_THRESHOLD ||
            proposition.votingStake[false] >= DECISION_THRESHOLD
        ) {
            proposition.decided = true;

            if (
                proposition.votingStake[true] >
                proposition.votingStake[false] &&
                proposition.certifyingStake[true] >
                proposition.certifyingStake[false]
            ) {
                proposition.trueOutcome = Outcomes.True;
            } else if (
                proposition.votingStake[false] >
                proposition.votingStake[true] &&
                proposition.certifyingStake[false] >
                proposition.certifyingStake[true]
            ) {
                proposition.trueOutcome = Outcomes.False;
            } else {
                proposition.trueOutcome = Outcomes.Undecided;
            }

            distributeVotingRewards(_propositionIndex, proposition.trueOutcome);
            distributeCertifierRewards(
                _propositionIndex,
                proposition.trueOutcome
            );
        }
    }

    function certifyProposition(
        uint256 _propositionIndex,
        bool _certification,
        uint256 _stake
    ) public {
        require(isPlayerRegistered(msg.sender), "Player is not registered");
        require(
            _stake <= karmaTokenContract.balanceOf(msg.sender),
            "Insufficient KarmaTokens to vote."
        );
        require(
            _stake >= MIN_CERTIFYING_STAKE,
            "Certifying stake is below the minimum."
        );
        require(
            !propositions[_propositionIndex].decided,
            "Proposition has already been decided."
        );

        karmaTokenContract.burn(msg.sender, _stake);
        Player storage player = players[msg.sender];
        Proposition storage proposition = propositions[_propositionIndex];

        // Update certifying stakes
        if (_certification) {
            proposition.certifyingStakeTrue += _stake;
        } else {
            proposition.certifyingStakeFalse += _stake;
        }
        proposition.certifyingStake[_certification] += _stake;
        player.certifyingStakes[_propositionIndex][_certification] += _stake;
    }

    function distributeVotingRewards(
        uint256 _propositionIndex,
        Outcomes _trueOutcome
    ) private {
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
                votingReward =
                    (player.votingStakes[_propositionIndex][true] *
                        bountyAmount) /
                    totalCorrectVotingStake +
                    player.votingStakes[_propositionIndex][true];
            } else if (_trueOutcome == Outcomes.False) {
                votingReward =
                    (player.votingStakes[_propositionIndex][false] *
                        bountyAmount) /
                    totalCorrectVotingStake +
                    player.votingStakes[_propositionIndex][false];
            } else {
                votingReward =
                    player.votingStakes[_propositionIndex][true] +
                    player.votingStakes[_propositionIndex][false];
            }
            karmaTokenContract.mint(playerAddress, votingReward);
        }
    }

    function distributeCertifierRewards(
        uint256 _propositionIndex,
        Outcomes _trueOutcome
    ) private {
        Proposition storage proposition = propositions[_propositionIndex];
        uint256 totalCorrectCertifyingStake;
        if (_trueOutcome == Outcomes.True) {
            totalCorrectCertifyingStake = proposition.certifyingStake[true];
        } else {
            totalCorrectCertifyingStake = proposition.certifyingStake[false];
        }
        uint256 rewardPoolAmount = proposition.rewardPool;

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            Player storage player = players[playerAddress];
            if (_trueOutcome == Outcomes.True) {
                uint256 certifierReward = (player.certifyingStakes[
                    _propositionIndex
                ][true] * rewardPoolAmount) /
                    totalCorrectCertifyingStake +
                    player.certifyingStakes[_propositionIndex][true];
                karmaTokenContract.mint(playerAddress, certifierReward);
            } else if (_trueOutcome == Outcomes.False) {
                uint256 certifierReward = (player.certifyingStakes[
                    _propositionIndex
                ][false] * rewardPoolAmount) /
                    totalCorrectCertifyingStake +
                    player.certifyingStakes[_propositionIndex][false];
                karmaTokenContract.mint(playerAddress, certifierReward);
            }
        }
    }
}
