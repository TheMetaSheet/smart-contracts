pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/DAOEngine.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MetaSheetDAO is Ownable {
    TokenInterface public token;
    NFTInterface public nft;
    DAOEngineInterface[] public daoEngines;

    uint256 public numOfDAOEngineProposal;
    struct DAOEngineProposal {
        string description;
        address daoEngineAddress;
        uint256 livePeriod;
        uint256 proposalId;
        bool executed;
    }
    mapping(uint256 => DAOEngineProposal) private daoEngineProposal;
    
    modifier onlyStakeholder(string memory message) {
        require(token.balanceOf(msg.sender) > 0, message);
        _;
    }

    modifier onlyValidDAOEngineProposal(uint256 proposalId) {
        DAOEngineProposal storage proposal = daoEngineProposal[proposalId];
        require(proposal.proposalId == proposalId, "invalid proposal id");
        require(proposal.executed == false, "proposal is already executed");
        require(
            proposal.livePeriod < block.timestamp,
            "there still have time before executed"
        );
        _;
    }

    function createProposal(
        string calldata _description,
        address _daoEngineAddress
    )
        external
        onlyStakeholder("Only stakeholders are allowed to create proposals")
    {
        uint256 proposalId = numOfDAOEngineProposal++;
        DAOEngineProposal storage proposal = daoEngineProposal[proposalId];
        proposal.description = _description;
        proposal.daoEngineAddress = _daoEngineAddress;
        proposal.executed = false;
        proposal.livePeriod = block.timestamp + 1 weeks;
    }

    function setToken(address tokenAddress) public onlyOwner {
        require(tokenAddress != address(0), "invalid address");
        require(address(token) == address(0), "Token is already set");
        token = TokenInterface(tokenAddress);
    }

    function setNFT(address nftAddress) public onlyOwner {
        require(nftAddress != address(0), "invalid address");
        require(address(nft) == address(0), "NFt is already set");
        nft = NFTInterface(nftAddress);
    }

    function setDAOEngine(uint256 proposalId)
        public
        onlyValidDAOEngineProposal(proposalId)
    {
        DAOEngineProposal storage proposal = daoEngineProposal[proposalId];
        require(proposal.daoEngineAddress != address(0), "invalid address");
        for (uint256 index = 0; index < daoEngines.length; index++) {
            require(
                address(daoEngines[index]) != proposal.daoEngineAddress,
                "Can not set used daoEngine"
            );
        }
        if (daoEngines.length != 0) {
            daoEngines[daoEngines.length - 1].lock();
        }
        DAOEngineInterface daoEngine = DAOEngineInterface(
            proposal.daoEngineAddress
        );
        daoEngine.acquire(address(this));
        daoEngines.push(daoEngine);
        proposal.executed = true;
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
