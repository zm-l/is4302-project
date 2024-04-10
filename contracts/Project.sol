// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./User.sol";

contract Project {
    User user;

    constructor(User userContract) {
        user = userContract;
    }

    function createUser(string memory name, string memory password) public {
        user.createUser(name, password, msg.sender);
    }

    function updateUser(string memory name, string memory password) public {
        user.updateUser(name, password, msg.sender);
    }

    function deleteUser() public {
        user.deleteUser(msg.sender);
    }
}
