// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract User {
    enum UserType {
        Certifier,
        Voter
    }

    struct user {
        string username;
        UserType userType;
        address owner;
        bool created;
    }

    mapping(address => user) userList;

    event userCreated(string username, UserType userType, address owner);
    event userUpdated(string userType, address owner);
    event userDeleted(address owner);

    uint256 public numUsers = 0;

    modifier validUser() {
        require(userList[msg.sender].created == true, "User does not exist!");
        _;
    }

    function createUser(string memory username) external {
        require(userList[msg.sender].created == false, "User already exists!");
        user memory newUser = user(username, UserType.Voter, msg.sender, true);
        userList[msg.sender] = newUser;
        numUsers++;

        emit userCreated(username, UserType.Voter, msg.sender);
    }

    function deleteUser() external validUser {
        userList[msg.sender].created = false;

        emit userDeleted(msg.sender);
    }

    function updateUser(string memory userType) external validUser {
        UserType newUserType = UserType.Voter;
        if (
            keccak256(abi.encodePacked(userType)) ==
            keccak256(abi.encodePacked("Certifier"))
        ) {
            newUserType = UserType.Certifier;
        }
        userList[msg.sender].userType = newUserType;

        emit userUpdated(userType, msg.sender);
    }

    function isValidUser() public view returns (bool) {
        return userList[msg.sender].created;
    }
}
