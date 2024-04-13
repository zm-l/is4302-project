const TwitterX = artifacts.require("TwitterX");
var assert = require("assert");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("testVote", accounts => {
    let decentralizedTwitter;

    before(async () => {
        decentralizedTwitter = await TwitterX.deployed();
    });

    describe("Tweet management", async () => {
        it("should create a tweet", async () => {
            const result = await decentralizedTwitter.createTweet("Hello, world!", { from: accounts[0] });
            assert.equal(result.logs[0].event, "TweetCreated", "Tweet should be created");
        });

        it("should update a tweet", async () => {
            await decentralizedTwitter.createTweet("Initial tweet", { from: accounts[0] });
            const update = await decentralizedTwitter.updateTweet(1, "Updated tweet", { from: accounts[0] });
            assert.equal(update.logs[0].event, "TweetUpdated", "Tweet should be updated");
        });

        it("should delete a tweet", async () => {
            await decentralizedTwitter.createTweet("Tweet to delete", { from: accounts[0] });
            const del = await decentralizedTwitter.deleteTweet(1, { from: accounts[0] });
            assert.equal(del.logs[0].event, "TweetDeleted", "Tweet should be deleted");
        });
    });

    describe("Voting on tweets", async () => {
        it("should allow a user to vote on a tweet", async () => {
            await decentralizedTwitter.createTweet("Tweet to vote on", { from: accounts[0] });
            await decentralizedTwitter.startProposition(4, { from: accounts[0] });
            const vote = await decentralizedTwitter.voteOnTweet(4, true, 1,{ from: accounts[1], value: web3.utils.toWei("0.1", "ether") });
            assert.equal(vote.logs[0].event, "Voted", "Vote should be recorded");
        });
    });
});