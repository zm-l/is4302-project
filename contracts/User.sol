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

    modifier validUser() {
        require(userList[msg.sender].created == true, "User does not exist!");
        _;
    }

    function createUser(
        string memory username,
        string memory password
    ) external {
        require(userList[msg.sender].created == false, "User already exists!");
        user memory newUser = user(username, password, msg.sender, true);
        userList[msg.sender] = newUser;
        numUsers++;

        emit userCreated(username, password, msg.sender);
    }

    function deleteUser() external validUser {
        userList[msg.sender].created = false;

        emit userDeleted(msg.sender);
    }

    function updateUser(
        string memory username,
        string memory password
    ) external validUser {
        userList[msg.sender].username = username;
        userList[msg.sender].password = password;

        emit userUpdated(username, password, msg.sender);
    }

    function isValidUser() public view returns (bool) {
        return userList[msg.sender].created;
    }
}
