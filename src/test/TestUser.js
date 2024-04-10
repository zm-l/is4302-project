const _deploy_contracts = require('../migrations/2_deploy_contract');
var assert = require("assert");
const { expectEvent } = require("@openzeppelin/test-helpers");

var User = artifacts.require("User");

contract("TestUser", function (accounts) {
    let instance;
    const tweetOwner = accounts[0];

    before(async () => {
        userInstance = await User.deployed();
        instance = await Project.deployed();
    });

    it("User", async () => {
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
        )

        expectEvent(tweetOwnerUser,
            {
                username: "tweetOwner",
                owner: tweetOwner
            })
    })
});