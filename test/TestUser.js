const _deploy_contracts = require('../migrations/2_deploy_contracts');
var assert = require("assert");
const { expectEvent } = require("@openzeppelin/test-helpers");

var User = artifacts.require("User");
var Project = artifacts.require("Project");

contract("TestUser", function (accounts) {
    let instance;
    const tweetOwner = accounts[0];

    before(async () => {
        userInstance = await User.deployed();
        instance = await Project.deployed();
    });

    it("should create new user", async () => {
        let tweetOwnerUser = await instance.createUser(
            "tweetOwner",
            "12345678",
            {
                from: tweetOwner
            }
        );

        assert.equal(
            await userInstance.isValidUser({ from: tweetOwner }),
            true
        );

        expectEvent.inTransaction(tweetOwnerUser.tx, User,
            {
                username: "tweetOwner",
                owner: tweetOwner
            }
        );
    });

});