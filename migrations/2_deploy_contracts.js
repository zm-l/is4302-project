
const TwitterX = artifacts.require("TwitterX");
const KarmaToken = artifacts.require("KarmaToken");
const ASTREA = artifacts.require("ASTREA");

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(KarmaToken, "KarmaToken", "KMT", web3.utils.toWei('5000', 'ether'));
    const karmaToken = await KarmaToken.deployed();

    await deployer.deploy(TwitterX);
    const twitterX = await TwitterX.deployed();

    await deployer.deploy(ASTREA, karmaToken.address, twitterX.address);
    const astrea = await ASTREA.deployed();
};
