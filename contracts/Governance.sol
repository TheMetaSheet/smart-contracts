pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/MetaSheetDAO.sol";
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
        bool executed;
        mapping(address => bool) votes;
    }

    function vote(uint256 proposalId, bool supportProposal) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        proposal.votes[msg.sender] = supportProposal;
    }

    modifier onlyValidDAOEngineProposal(uint256 proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposalId == proposalId, "invalid proposal id");
        require(proposal.executed == false, "proposal is already executed");
        require(
            proposal.livePeriod < block.timestamp || true,
            "there still have time before executed"
        );
        _;
    }

    function createProposal(string memory _description, bytes memory _params)
        public
        onlyOwner
    {
        Proposal storage proposal = proposals[proposalCount];
        proposal.description = _description;
        proposal.params = _params;
        proposal.executed = false;
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
        proposals[proposalId].executed = true;
    }
}
