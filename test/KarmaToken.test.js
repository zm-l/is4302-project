const KarmaToken = artifacts.require("KarmaToken");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("KarmaToken Contract", accounts => {
    let karmaToken;

    beforeEach(async () => {
        karmaToken = await KarmaToken.new("Karma", "KAR", web3.utils.toWei("1000", "ether"), { from: accounts[0] });
    });

    it("should have the correct name, symbol, and initial supply", async () => {
        const name = await karmaToken.name();
        const symbol = await karmaToken.symbol();
        const totalSupply = await karmaToken.totalSupply();

        assert.strictEqual(name, "Karma", "Name should match");
        assert.strictEqual(symbol, "KAR", "Symbol should match");
        assert.strictEqual(totalSupply.toString(), web3.utils.toWei("1000", "ether"), "Total supply should match");
    });

    it("should mint tokens to an account", async () => {
        const account = accounts[1];
        const amount = web3.utils.toWei("100", "ether");

        const tx = await karmaToken.mint(account, amount, { from: accounts[0] });

        expectEvent(tx, "Transfer", {
            from: "0x0000000000000000000000000000000000000000",
            to: account,
            value: amount
        });

        const balance = await karmaToken.balanceOf(account);
        assert.strictEqual(balance.toString(), amount, "Balance should match");
    });

    it("should burn tokens from an account", async () => {
        const account = accounts[2];
        const initialBalance = web3.utils.toWei("200", "ether");
        const amountToBurn = web3.utils.toWei("50", "ether");

        await karmaToken.mint(account, initialBalance, { from: accounts[0] });
        const tx = await karmaToken.burn(account, amountToBurn, { from: accounts[0] });

        expectEvent(tx, "Transfer", {
            from: account,
            to: "0x0000000000000000000000000000000000000000",
            value: amountToBurn
        });

        const balance = await karmaToken.balanceOf(account);
        assert.strictEqual(parseInt(balance.toString()), initialBalance - amountToBurn, "Balance should match");
    });

    it("should not allow burning more tokens than the account has", async () => {
        const account = accounts[3];
        const initialBalance = web3.utils.toWei("100", "ether");
        const amountToBurn = web3.utils.toWei("150", "ether");

        await karmaToken.mint(account, initialBalance, { from: accounts[0] });

        await expectRevert(
            karmaToken.burn(account, amountToBurn, { from: accounts[0] }),
            "ERC20: burn amount exceeds balance"
        );
    });

    it("should return correct balance for an account", async () => {
        const account = accounts[4];
        const initialBalance = web3.utils.toWei("300", "ether");

        await karmaToken.mint(account, initialBalance, { from: accounts[0] });

        const balance = await karmaToken.balanceOf(account);
        assert.strictEqual(balance.toString(), initialBalance, "Balance should match");
    });
});
