const User = artifacts.require("User");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("User Contract Test", accounts => {
    let userContract;

    beforeEach(async () => {
        userContract = await User.new({ from: accounts[0] });
    });

    it("should create a new user", async () => {
        const username = "Alice";
        const tx = await userContract.createUser(username, { from: accounts[1] });

        expectEvent(tx, "userCreated", {
            username: username,
            owner: accounts[1]
        });
    });

    it("should not create a user if already exists", async () => {
        const username = "Bob";
        await userContract.createUser(username, { from: accounts[2] });

        await expectRevert(
            userContract.createUser(username, { from: accounts[2] }),
            "User already exists!"
        );
    });

    it("should delete an existing user", async () => {
        const username = "Charlie";
        await userContract.createUser(username, { from: accounts[3] });

        const tx = await userContract.deleteUser({ from: accounts[3] });

        expectEvent(tx, "userDeleted", {
            owner: accounts[3]
        });
    });

    it("should not delete a non-existing user", async () => {
        await expectRevert(
            userContract.deleteUser({ from: accounts[4] }),
            "User does not exist!"
        );
    });

    it("should update user type", async () => {
        const username = "David";
        await userContract.createUser(username, { from: accounts[5] });

        const tx = await userContract.updateUser("Certifier", { from: accounts[5] });

        expectEvent(tx, "userUpdated", {
            userType: "Certifier",
            owner: accounts[5]
        });
    });

    it("should not update user type for non-existing user", async () => {
        await expectRevert(
            userContract.updateUser("Certifier", { from: accounts[6] }),
            "User does not exist!"
        );
    });

    it("should check if user is valid", async () => {
        const isValid = await userContract.isValidUser({ from: accounts[7] });
        assert.strictEqual(isValid, false, "User should not be valid initially");

        const username = "Eve";
        await userContract.createUser(username, { from: accounts[7] });

        const isValidAfterCreation = await userContract.isValidUser({ from: accounts[7] });
        assert.strictEqual(isValidAfterCreation, true, "User should be valid after creation");
    });
});
