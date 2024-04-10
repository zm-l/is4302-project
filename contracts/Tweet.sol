// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Tweet {
    uint id;
    address owner;

    constructor() {
        owner = msg.sender;
    }
}
