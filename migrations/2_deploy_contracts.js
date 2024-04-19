<<<<<<< Updated upstream
//const User = artifacts.require("User");
=======
>>>>>>> Stashed changes
const TwitterX = artifacts.require("TwitterX");
const KarmaToken = artifacts.require("KarmaToken");
const ASTREA = artifacts.require("ASTREA");

<<<<<<< Updated upstream
module.exports = (deployer, network, account) => {
    deployer
        .deploy(TwitterX);
}
=======
module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(KarmaToken, "KarmaToken", "KMT", web3.utils.toWei('500000000000000000000', 'ether'));
    const karmaToken = await KarmaToken.deployed();

    await deployer.deploy(TwitterX);
    const twitterX = await TwitterX.deployed();

    await deployer.deploy(ASTREA, web3.utils.toWei('1000', 'ether'), twitterX.address);
    const astrea = await ASTREA.deployed();
};
>>>>>>> Stashed changes
