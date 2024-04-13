// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TwitterX {
    struct Tweet {
        uint id;
        address author;
        string content;
        bool isProposition;
        uint totalVotes;
        mapping(address => uint) stakes;
        mapping(address => bool) hasVoted;
    }

    struct Vote {
        address participant;
        bool vote; // true for yes, false for no
        uint role; // 1 for voter, 2 for certifier
        uint stake;
    }

    Tweet[] public tweets;
    mapping(uint => Vote[]) public votes; // mapping from tweet ID to list of votes

    uint public nextTweetId = 1;

    event TweetCreated(uint tweetId, address author, string content);
    event TweetUpdated(uint tweetId, string newContent);
    event TweetDeleted(uint tweetId);
    event PropositionStarted(uint tweetId);
    event Voted(uint tweetId, address voter, bool vote, uint role, uint stake);

    function createTweet(string memory content) public {
        Tweet storage newTweet = tweets.push();  // Push an empty struct to the array
        newTweet.id = nextTweetId;
        newTweet.author = msg.sender;
        newTweet.content = content;
        newTweet.isProposition = false;
        newTweet.totalVotes = 0; 
        emit TweetCreated(nextTweetId, msg.sender, content);
        nextTweetId++;
    }

    function updateTweet(uint tweetId, string memory newContent) public {
        require(tweets[tweetId - 1].author == msg.sender, "Only the author can update the tweet.");
        tweets[tweetId - 1].content = newContent;
        emit TweetUpdated(tweetId, newContent);
    }

    function deleteTweet(uint tweetId) public {
        require(tweets[tweetId - 1].author == msg.sender, "Only the author can delete the tweet.");
        delete tweets[tweetId - 1];
        emit TweetDeleted(tweetId);
    }

    function startProposition(uint tweetId) public {
        require(tweets[tweetId - 1].author == msg.sender, "Only the author can start a proposition.");
        tweets[tweetId - 1].isProposition = true;
        emit PropositionStarted(tweetId);
    }

    function voteOnTweet(uint tweetId, bool vote, uint role) public payable {
        require(tweets[tweetId - 1].isProposition, "This tweet is not a proposition.");
        require(!tweets[tweetId - 1].hasVoted[msg.sender], "You have already voted on this tweet.");
        require(msg.value > 0, "You must stake some amount of ether to vote.");
        require(role == 1 || role == 2, "Invalid role: use 1 for voter, 2 for certifier.");

        tweets[tweetId - 1].hasVoted[msg.sender] = true;
        tweets[tweetId - 1].stakes[msg.sender] = msg.value;
        tweets[tweetId - 1].totalVotes++;

        votes[tweetId].push(Vote(msg.sender, vote, role, msg.value));
        emit Voted(tweetId, msg.sender, vote, role, msg.value);
    }
}