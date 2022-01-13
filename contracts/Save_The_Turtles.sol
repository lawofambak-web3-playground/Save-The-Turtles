// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Save_The_Turtles {
    uint256 totalDonators;

    address payable public owner;

    event newDonation(address indexed donator, string name);

    constructor() payable {
        // Assigns the address that deployed this contract to become the owner
        owner = payable(msg.sender);
    }

    struct DonatorInfo {
        address donator;
        string name;
    }

    DonatorInfo[] donations;

    // Simple function to return to total amount of donators
    function getAllDonators() public view returns (uint256) {
        return totalDonators;
    }

    // Simple function to return a struct array of all the donator's information
    function getAllDonationInfo() public view returns (DonatorInfo[] memory) {
        return donations;
    }

    // Transaction function that requires a "_name" string
    function donate(string memory _name) public payable {
        // Requires that the person donating actually has enough funds
        require(
            msg.sender.balance >= msg.value,
            "Insufficient funds to make a donation"
        );

        totalDonators += 1;

        donations.push(DonatorInfo(msg.sender, _name));

        // Sending ether
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Failed to make a donation");

        emit newDonation(msg.sender, _name);
    }
}
