//const User = artifacts.require("User");
const TwitterX = artifacts.require("TwitterX");

module.exports = (deployer, network, account) => {
    deployer
        .deploy(TwitterX);
}