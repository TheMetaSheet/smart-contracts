pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/TheMetaSheet.sol";
import "./interfaces/DAOEngine.sol";

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

    function vote(uint256 proposalId, bool supportProposal) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        proposal.votes[msg.sender] = supportProposal;
        proposal.addresses[proposal.voteCount] = msg.sender;
        proposal.voteCount++;
    }

    function countVote(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.isVotingCounted, "voting is already counted");
        for (uint256 j = 0; j < proposal.voteCount; j++) {
            if (proposal.votes[proposal.addresses[j]]) proposal.votesFor++;
            else proposal.votesAgainst++;
        }
        proposal.votingPassed = proposal.votesFor > proposal.votesAgainst;
        proposal.isVotingCounted = true;
    }

    function createProposal(string memory _description, bytes memory _params)
        public
        onlyOwner
    {
        Proposal storage proposal = proposals[proposalCount];
        proposal.description = _description;
        proposal.params = _params;
        proposal.isExecuted = false;
        proposal.livePeriod = block.timestamp + 1 weeks;
        proposal.proposalId = proposalCount;
        proposalCount = proposalCount + 1;
    }

    function getProposalParams(uint256 proposalId)
        public
        view
        returns (bytes memory params)
    {
        return proposals[proposalId].params;
    }

    function setProposalExecuted(uint256 proposalId) public {
        require(
            proposals[proposalId].proposalId == proposalId && proposalId != 0,
            "invalid proposal id"
        );
        require(
            proposals[proposalId].isExecuted == false,
            "proposal is already executed"
        );
        require(
            proposals[proposalId].votingPassed == false,
            "proposal voting is not passed"
        );
        proposals[proposalId].isExecuted = true;
    }
}
