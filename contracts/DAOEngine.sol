pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/MetaSheetDAO.sol";
import "./interfaces/DAOEngine.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOEngine is Ownable {
    TokenInterface public token;
    NFTInterface public nft;
    MetaSheetDAOInterface public metaSheetDAO;
    bool public locked = false;

    modifier notLocked() {
        require(locked == false, "DAOEngine: Engine is locked");
        _;
    }

    function lock() public virtual onlyOwner notLocked {
        locked = true;
    }

    function acquire(address _metaSheetDAO) public virtual onlyOwner notLocked {
        require(
            address(metaSheetDAO) == address(0),
            "DAOEngine: Engine is already acquired"
        );
        require(
            address(_metaSheetDAO) != address(0),
            "DAOEngine: invalid address"
        );
        metaSheetDAO = MetaSheetDAOInterface(_metaSheetDAO);
        token = TokenInterface(metaSheetDAO.token());
        nft = NFTInterface(metaSheetDAO.nft());
    }
}
