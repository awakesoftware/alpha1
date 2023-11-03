// SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity 0.8.9;

contract AwakeVideo {
    string public name = "AwakeVideo";
    address public owner;
    uint public videoCount = 0;

    struct VideoModel {
        uint id;
        string title;
        address author;
    }

    mapping(uint => VideoModel) public videos;

    event Uploaded(
        uint id,
		string title,
		address author
    );

    modifier onlyOwner() {
        require(owner == msg.sender, "Only the contract owner can perform this action.");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    // function shutDownContract() payable public onlyOwner () {
    //     selfdestruct(payable(owner));
    // }

    function uploadVideo( string memory _title ) public {
        require(bytes(_title).length > 0, "No video title detected.");
        require(msg.sender != address(0), "No address detected for function caller.");

        videoCount++;

        videos[videoCount] = VideoModel( videoCount, _title, msg.sender );

        emit Uploaded( videoCount, _title, msg.sender );
    }

}