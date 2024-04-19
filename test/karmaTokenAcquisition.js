const KarmaToken = artifacts.require("KarmaToken");
const ASTREA = artifacts.require("ASTREA");

contract("KarmaToken Acquisition Test", accounts => {
    let astrea;
    let karmaToken;

    before(async () => {
        karmaToken = await KarmaToken.deployed();
        astrea = await ASTREA.deployed();
    });

    it("should allow users to get KarmaTokens correctly", async () => {
        // Record initial balance
        const initialBalance = await karmaToken.balanceOf(accounts[1]);

        // Amount of tokens to get
        const amount = web3.utils.toWei('50', 'ether');  // 50 KMT

        // Call the function to get KarmaTokens
        await astrea.getKarmaToken(amount, { from: accounts[1] });

        // Get the new balance
        const newBalance = await karmaToken.balanceOf(accounts[1]);

        // Convert balances to readable format (optional)
        const initialBalanceEther = web3.utils.fromWei(initialBalance, 'ether');
        const newBalanceEther = web3.utils.fromWei(newBalance, 'ether');

        // Output the result (optional, for debugging purposes)
        console.log(`Initial balance: ${initialBalanceEther} KMT, New balance: ${newBalanceEther} KMT`);
        // Check if the balance increased by the expected amount
        assert.equal(
            newBalance.sub(initialBalance).toString(),
            amount,
            "The balance should increase by the amount of KarmaTokens obtained"
        );

        
    });
});
