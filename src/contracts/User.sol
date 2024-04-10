// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract User {
    struct user {
        string username;
        string password;
        address owner;
        bool created;
    }

    mapping(address => user) userList;

    event userCreated(string username, string password, address owner);
    event userUpdated(string username, string password, address owner);
    event userDeleted(address owner);

    uint256 public numUsers = 0;

    modifier validUser(address owner) {
        require(userList[owner].created == true, "User does not exist!");
        _;
    }

    function createUser(
        string memory username,
        string memory password,
        address owner
    ) external {
        require(userList[owner].created == false, "User already exists!");
        user memory newUser = user(username, password, owner, true);
        userList[owner] = newUser;
        numUsers++;

        emit userCreated(username, password, owner);
    }

    function deleteUser(address owner) external validUser(owner) {
        userList[owner].created = false;
        numUsers--;

        emit userDeleted(owner);
    }

    function updateUser(
        string memory username,
        string memory password,
        address owner
    ) external validUser(owner) {
        userList[owner].username = username;
        userList[owner].password = password;

        emit userUpdated(username, password, owner);
    }

    function isValidUser() public view returns (bool) {
        return userList[tx.origin].created;
    }
}
