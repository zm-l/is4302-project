const User = artifacts.require("User");

module.exports = (deployer, network, account) => {
    deployer
        .deploy(User);
}