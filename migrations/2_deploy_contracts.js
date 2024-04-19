const User = artifacts.require("User");
const KarmaToken = artifacts.require("KarmaToken");
const TwitterX = artifacts.require("TwitterX");

module.exports = (deployer, network, account) => {
    deployer.deploy(User);
    deployer.deploy(KarmaToken, "KarmaToken", "KT", 10000);
    deployer.deploy(TwitterX);
}