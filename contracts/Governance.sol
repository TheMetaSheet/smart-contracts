//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/TheMetaSheetInterface.sol";
import "./interfaces/DAOEngineInterface.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Governance is Ownable {
    TokenInterface public token;
    uint256 public proposalCount = 1;
    mapping(uint256 => Proposal) private proposals;

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "invalid Token address");
        token = TokenInterface(tokenAddress);
    }

    struct Proposal {
        string description;
        bytes params;
        uint256 livePeriod;
        uint256 proposalId;
        bool isExecuted;
        uint256 voteCount;
        uint256 votesFor;
        uint256 votesAgainst;
        bool votingPassed;
        bool isVotingCounted;
        mapping(uint256 => address) addresses;
        mapping(address => bool) votes;
    }
}