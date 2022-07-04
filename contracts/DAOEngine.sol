//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/TheMetaSheetInterface.sol";
import "./interfaces/DAOEngineInterface.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOEngine is Ownable {
    TokenInterface public token;
    NFTInterface public nft;
    TheMetaSheetInterface public theMetaSheet;
    bool public locked = false;

    modifier notLocked() {
        require(locked == false, "DAOEngine: Engine is locked");
        _;
    }

    function lock() public virtual onlyOwner notLocked {
        locked = true;
    }

    function acquire(address _TheMetaSheet) public virtual onlyOwner notLocked {
        require(
            address(theMetaSheet) == address(0),
            "DAOEngine: Engine is already acquired"
        );
        require(
            address(_TheMetaSheet) != address(0),
            "DAOEngine: invalid address"
        );
        theMetaSheet = TheMetaSheetInterface(_TheMetaSheet);
        token = TokenInterface(theMetaSheet.getTokenAddress());
        nft = NFTInterface(theMetaSheet.getNFTAddress());
    }
}