// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Tweet {
    struct tweet {
        uint256 id;
        string content;
        address owner;
        bool created;
    }

    mapping(uint256 => tweet) tweetList;

    event tweetCreated(string content, address owner);
    event tweetDeleted(uint256 id, address owner);

    uint256 public numTweets = 0;

    modifier validTweet(uint256 id) {
        require(tweetList[id].created == true, "Tweet does not exist!");
        _;
    }

    function createTweet(string memory content, address owner) external {
        tweet memory newTweet = tweet(numTweets, content, owner, true);
        tweetList[numTweets] = newTweet;
        numTweets++;

        emit tweetCreated(content, owner);
    }

    function deleteTweet(uint256 id, address owner) external validTweet(id) {
        tweetList[id].created = false;

        emit tweetDeleted(id, owner);
    }

    function isValidTweet(uint256 id) public view returns (bool) {
        return tweetList[id].created;
    }
}
