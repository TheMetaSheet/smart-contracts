//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface GovernanceInterface {
    struct Proposal {
        string description;
        address daoEngineAddress;
        uint256 livePeriod;
        uint256 proposalId;
        bool executed;
        mapping(address => bool) votes;
    }

    function vote(uint256 proposalId, bool supportProposal) external;

    function createProposal(
        string calldata _description,
        bytes calldata _params
    ) external;

    function getProposalParams(uint256 proposalId)
        external
        view
        returns (bytes memory params);

    function setProposalExecuted(uint256 proposalId) external;
}
