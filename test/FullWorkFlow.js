const TwitterX = artifacts.require("TwitterX");
const KarmaToken = artifacts.require("KarmaToken");
const ASTREA = artifacts.require("ASTREA");

contract("Full Workflow Test", accounts => {
    let twitterX, karmaToken, astrea;

    before(async () => {
        karmaToken = await KarmaToken.deployed();
        twitterX = await TwitterX.deployed();
        astrea = await ASTREA.deployed();
    });


    it("Same vote", async () => {
        const createTx = await twitterX.createTweet("Hello, blockchain world!", { from: accounts[0] });
        assert.equal(createTx.logs[0].event, "TweetCreated", "Tweet should be created");


        const tweetId = createTx.logs[0].args.tweetId.toNumber();
        await astrea.addProposition(tweetId, web3.utils.toWei('50', 'ether'), web3.utils.toWei('50', 'ether'), { from: accounts[0] });


        await karmaToken.mint(accounts[1], web3.utils.toWei('100', 'ether'), { from: accounts[1] });
        await karmaToken.mint(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[2] });


        await astrea.addPlayer(accounts[1]);
        await astrea.addPlayer(accounts[2]);

        await astrea.certifyProposition(0, false, web3.utils.toWei('47', 'ether'), { from: accounts[2] });
        await astrea.voteOnProposition(0, false, web3.utils.toWei('5', 'ether'), { from: accounts[1] });




        //await astrea.distributeRewards(tweetId);

        let balanceVoter = await karmaToken.balanceOf(accounts[1]);
        let balanceCertifier = await karmaToken.balanceOf(accounts[2]);

        console.log(`Voter balance after rewards: ${web3.utils.fromWei(balanceVoter, 'ether')} KMT`);
        console.log(`Certifier balance after rewards: ${web3.utils.fromWei(balanceCertifier, 'ether')} KMT`);

        assert(balanceVoter.gt(web3.utils.toWei('100', 'ether')), "Voter should have more tokens after rewards");
        assert(balanceCertifier.gt(web3.utils.toWei('100', 'ether')), "Certifier should have more tokens after rewards");
    });

    it("Different vote", async () => {
        const createTx = await twitterX.createTweet("Hello, blockchain world!", { from: accounts[3] });
        assert.equal(createTx.logs[0].event, "TweetCreated", "Tweet should be created");


        const tweetId = createTx.logs[0].args.tweetId.toNumber();
        await astrea.addProposition(tweetId, web3.utils.toWei('50', 'ether'), web3.utils.toWei('50', 'ether'), { from: accounts[3] });


        await karmaToken.mint(accounts[1], web3.utils.toWei('100', 'ether'), { from: accounts[1] });
        await karmaToken.mint(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[1] });


        //await astrea.addPlayer(accounts[1]);
        //await astrea.addPlayer(accounts[2]);

        await astrea.certifyProposition(1, false, web3.utils.toWei('47', 'ether'), { from: accounts[1] });
        await astrea.voteOnProposition(1, true, web3.utils.toWei('5', 'ether'), { from: accounts[2] });




        //await astrea.distributeRewards(tweetId);

        let balanceVoter = await karmaToken.balanceOf(accounts[4]);
        let balanceCertifier = await karmaToken.balanceOf(accounts[5]);

        console.log(`Voter balance after rewards: ${web3.utils.fromWei(balanceVoter, 'ether')} KMT`);
        console.log(`Certifier balance after rewards: ${web3.utils.fromWei(balanceCertifier, 'ether')} KMT`);

        assert(balanceVoter.gt(web3.utils.toWei('100', 'ether')), "Voter should have more tokens after rewards");
        assert(balanceCertifier.gt(web3.utils.toWei('100', 'ether')), "Certifier should have more tokens after rewards");
    });
});