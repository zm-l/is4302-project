const User = artifacts.require("User");
const Project = artifacts.require("Project");

module.exports = (deployer, network, account) => {
    deployer
        .deploy(User);
}