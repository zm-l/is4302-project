const TwitterX = artifacts.require("TwitterX");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("TwitterX Contract", accounts => {
    let twitterContract;

    beforeEach(async () => {
        twitterContract = await TwitterX.new({ from: accounts[0] });
    });

    it("should create a new tweet", async () => {
        const content = "Hello, world!";
        const tx = await twitterContract.createTweet(content, { from: accounts[1] });

        expectEvent(tx, "TweetCreated", {
            tweetId: "1",
            author: accounts[1],
            content: content
        });
    });

    it("should update a tweet", async () => {
        const initialContent = "Initial tweet";
        await twitterContract.createTweet(initialContent, { from: accounts[2] });

        const newContent = "Updated tweet";
        const tx = await twitterContract.updateTweet(1, newContent, { from: accounts[2] });

        expectEvent(tx, "TweetUpdated", {
            tweetId: "1",
            newContent: newContent
        });
    });

    it("should delete a tweet", async () => {
        const contentToDelete = "Tweet to delete";
        await twitterContract.createTweet(contentToDelete, { from: accounts[3] });

        const tx = await twitterContract.deleteTweet(1, { from: accounts[3] });

        expectEvent(tx, "TweetDeleted", {
            tweetId: "1"
        });
    });

    it("should not allow non-author to update a tweet", async () => {
        await twitterContract.createTweet("Unauthorized tweet", { from: accounts[4] });

        await expectRevert(
            twitterContract.updateTweet(1, "Attempted update", { from: accounts[5] }),
            "Only the author can update the tweet."
        );
    });

    it("should not allow non-author to delete a tweet", async () => {
        await twitterContract.createTweet("Unauthorized tweet", { from: accounts[6] });

        await expectRevert(
            twitterContract.deleteTweet(1, { from: accounts[7] }),
            "Only the author can delete the tweet."
        );
    });

    it("should get tweet content and author correctly", async () => {
        const content = "Test tweet";
        await twitterContract.createTweet(content, { from: accounts[8] });

        const tweetDetails = await twitterContract.getTweet(1);

        assert.strictEqual(tweetDetails[0], content, "Tweet content should match");
        assert.strictEqual(tweetDetails[1], accounts[8], "Tweet author should match");
    });
});
