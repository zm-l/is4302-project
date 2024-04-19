const _deploy_contracts = require('../migrations/2_deploy_contracts');
var assert = require("assert");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

var User = artifacts.require("User");

contract("TestUser", function (accounts) {
    let userInstance;
    const accountOne = accounts[0];

    beforeEach(async () => {
        userInstance = await User.deployed();
    });

    it("should create new user", async () => {
        const userOne = await userInstance.createUser("userOne", "12345678", { from: accountOne });
        assert.equal(await userInstance.isValidUser({ from: accountOne }), true);
        expectEvent(userOne, "userCreated");

    });

    it("should not create user if exists", async () => {
        await expectRevert(
            userInstance.createUser("userTwo", "12345678", { from: accountOne }),
            "User already exists!");
    });

    it("should update user details", async () => {
        const newUserOne = await userInstance.updateUser("newUserOne", "12345678", { from: accountOne })
        assert.equal(await userInstance.isValidUser({ from: accountOne }), true);
        expectEvent(newUserOne, "userUpdated");
    })

});
