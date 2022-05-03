pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/DAOEngine.sol";
import "./interfaces/Governance.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MetaSheetDAO is Ownable {
    TokenInterface public token;
    NFTInterface public nft;
    GovernanceInterface public governance;
    DAOEngineInterface[] public daoEngines;

    constructor(
        address tokenAddress,
        address nftAddress,
        address governanceAddress
    ) {
        require(tokenAddress != address(0), "invalid Token address");
        require(nftAddress != address(0), "invalid NFT address");
        require(nftAddress != address(0), "invalid Governance address");
        token = TokenInterface(tokenAddress);
        nft = NFTInterface(nftAddress);
        governance = GovernanceInterface(governanceAddress);
    }

    modifier onlyStakeholder(string memory message) {
        require(token.balanceOf(msg.sender) > 0, message);
        _;
    }

    function createDAOEngineProposal(
        string calldata _description,
        address daoEngineAddress
    )
        public
        onlyStakeholder("Only stakeholders are allowed to create Proposal")
    {
        governance.createProposal(_description, abi.encode(daoEngineAddress));
    }

    function vote(uint256 proposalId, bool supportProposal)
        public
        onlyStakeholder("Only stakeholders are allowed to vote")
    {
        governance.vote(proposalId, supportProposal);
    }

    function setDAOEngine(uint256 proposalId) public {
        bytes memory params = governance.getProposalParams(proposalId);
        address daoEngineAddress = abi.decode(params, (address));
        require(daoEngineAddress != address(0), "invalid address");
        for (uint256 index = 0; index < daoEngines.length; index++) {
            require(
                address(daoEngines[index]) != daoEngineAddress,
                "Can not set used daoEngine"
            );
        }
        if (daoEngines.length != 0) {
            daoEngines[daoEngines.length - 1].lock();
        }
        DAOEngineInterface daoEngine = DAOEngineInterface(daoEngineAddress);
        daoEngine.acquire(address(this));
        daoEngines.push(daoEngine);
        governance.setProposalExecuted(proposalId);
    }

    function getNFTAddress() public view returns (address) {
        return address(nft);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function getDAOEngineAddress() public view returns (address) {
        return address(daoEngines[daoEngines.length - 1]);
    }
}
