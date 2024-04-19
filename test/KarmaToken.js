const KarmaToken = artifacts.require("KarmaToken");
const { expect } = require('chai');
const { BN, expectEvent } = require('@openzeppelin/test-helpers');

contract("KarmaToken", function ([deployer, user]) {
    const initialSupply = new BN('1000000');

    beforeEach(async function () {
        this.token = await KarmaToken.new("KarmaToken", "KMT", initialSupply);
    });

    it('should create an initial supply of tokens', async function () {
        expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply);
        expect(await this.token.balanceOf(deployer)).to.be.bignumber.equal(initialSupply);
    });

    it('allows owner to mint tokens', async function () {
        const mintAmount = new BN('1000');
        const { logs } = await this.token.mint(user, mintAmount, { from: deployer });
        expectEvent.inLogs(logs, 'Transfer', {
            from: '0x0000000000000000000000000000000000000000',
            to: user,
            value: mintAmount,
        });

        const finalBalance = await this.token.balanceOf(user);
        console.log(`Final Balance after minting: ${finalBalance.toString()} tokens`);
        expect(finalBalance).to.be.bignumber.equal(mintAmount);
    });

    it('allows owner to burn tokens', async function () {
        const burnAmount = new BN('1000');
        await this.token.mint(user, burnAmount, { from: deployer }); // Mint first to ensure there are tokens to burn
        
        const balancePostMint = await this.token.balanceOf(user);
        console.log(`Balance after minting (before burning): ${balancePostMint.toString()} tokens`);

        const { logs } = await this.token.burn(user, burnAmount, { from: deployer });
        expectEvent.inLogs(logs, 'Transfer', {
            from: user,
            to: '0x0000000000000000000000000000000000000000',
            value: burnAmount,
        });

        const finalBalancePostBurn = await this.token.balanceOf(user);
        console.log(`Final Balance after burning: ${finalBalancePostBurn.toString()} tokens`);
        expect(finalBalancePostBurn).to.be.bignumber.equal(new BN('0'));
    });
});
