const KarmaToken = artifacts.require("KarmaToken");
const ASTREA = artifacts.require("ASTREA");
const TwitterX = artifacts.require("TwitterX");

    

contract("ASTREA Get KarmaToken Test", function ([deployer, user]) {
    let twitterX, karmaToken, astrea;

    before(async () => {
        karmaToken = await KarmaToken.deployed();
        twitterX = await TwitterX.deployed();
        astrea = await ASTREA.deployed();
    });

    it('should allow users to get KarmaTokens correctly', async function () {
        const amount = web3.utils.toWei('100', 'ether');  // Amount of tokens the user wants to get
        const initialBalance = await karmaToken.balanceOf(user);

        // User calls getKarmaToken to mint tokens to themselves
        await astrea.getKarmaToken(amount, { from: user });

        
        const newBalance = await karmaToken.balanceOf(user);

        console.log(`User's initial balance: ${web3.utils.fromWei(initialBalance, 'ether')} KMT`);
        console.log(`User's new balance after getKarmaToken: ${web3.utils.fromWei(newBalance, 'ether')} KMT`);

        assert.equal(
            newBalance.toString(),
            (new web3.utils.BN(initialBalance).add(new web3.utils.BN(amount))).toString(),
            "User's balance should increase by the amount of tokens minted"
        );

        // Output for debugging
        
    });
});

