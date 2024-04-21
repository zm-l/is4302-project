const { expect } = require("chai");

describe("ASTRAEA Contract", function () {
    let ASTRAEA;
    let astraea;
    let karmaToken;
    var owner, accountOne, accountTwo, astraeaAccOne, astraeaAccTwo;

    before(async () => {
        ASTRAEA = await ethers.getContractFactory("ASTRAEA");

        astraea = await ASTRAEA.deploy(1000000000);
        [owner, accountOne, accountTwo] = await ethers.getSigners();
        astraeaAccOne = astraea.connect(accountOne);
        astraeaAccTwo = astraea.connect(accountTwo);
    });

    it("should be registered as a player", async function () {
        const tx = await astraea.addPlayer(accountOne.address);

        await expect(tx).to.emit(astraea, "PlayerAdded");
    });

    it("should be registered as a player", async function () {
        const tx = await astraea.addPlayer(accountTwo.address);

        await expect(tx).to.emit(astraea, "PlayerAdded");
    });

    it("should not be registered as a player", async function () {
        await expect(astraea.addPlayer(accountOne.address)).to.be.revertedWith("Player is already registered");
    });

    it("should not add a proposition", async function () {
        await expect(astraeaAccOne.addProposition("tweetURL", 100, 100)).to.be.revertedWith("Insufficient KarmaTokens to provide as bounty");
    });

    it("should get KarmaTokens", async function () {
        const tx = await astraeaAccOne.getKarmaToken(3000);

        await expect(tx).to.emit(astraea, "KarmaTokensObtained");
    });

    it("should add a proposition", async function () {
        await astraeaAccOne.addProposition("tweetURL", 100, 100);
        const propositionLength = await astraea.getPropositionLength();
        expect(propositionLength).to.equal(1);
    });

    it("should vote on a proposition", async function () {
        await astraeaAccOne.voteOnProposition(0, true, 100);
        const playerStakes = await astraea.getPlayerVotingStakes(accountOne.address, 0);
        const stakes = playerStakes[0];
        expect(stakes).to.equal(100);
    });

    it("should select a random proposition", async function () {
        await astraeaAccOne.addProposition("tweetURL2", 100, 100);
        const propositionIndex = await astraeaAccOne.getRandomProposition(50);
        expect(propositionIndex).to.be.at.least(0);
    });

    it("should get player voting stakes", async function () {
        await astraeaAccOne.voteOnProposition(0, true, 100);
        const votingStakes = await astraea.getPlayerVotingStakes(accountOne.address, 0);
        const stakes = votingStakes[0];
        expect(stakes).to.equal(200);
    });

    it("should get player certifying stakes", async function () {
        await astraeaAccOne.certifyProposition(0, true, 100);
        const certifyingStakes = await astraeaAccOne.getPlayerCertifyingStakes(accountOne.address, 0);
        const stakes = certifyingStakes[0];
        expect(stakes).to.equal(100);
    });

    it("should decide a proposition and distribute rewards", async function () {
        await astraeaAccOne.voteOnProposition(0, true, 100);
        await astraeaAccOne.voteOnProposition(0, true, 100);
        await astraeaAccOne.voteOnProposition(0, true, 100);
        await astraeaAccOne.voteOnProposition(0, true, 100);
        await astraeaAccOne.voteOnProposition(0, true, 100);
        await astraeaAccOne.voteOnProposition(0, true, 100);

        await astraeaAccTwo.getKarmaToken(100);
        await astraeaAccTwo.voteOnProposition(0, true, 100);

        await astraeaAccOne.certifyProposition(0, true, 500);
        await astraeaAccOne.certifyProposition(0, false, 500);

        // Proposition decided
        await astraeaAccOne.voteOnProposition(0, true, 100);

        const proposition = await astraea.propositions(0);
        expect(proposition.decided).to.be.true;

        // Check player balances to ensure rewards were distributed
        const playerBalance = await astraeaAccOne.getKarmaTokenBalance();
        expect(playerBalance).to.be.equal(3340);
    });
});
