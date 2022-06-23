//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/TheMetaSheet.sol";
import "./interfaces/DAOEngine.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOEngine is Ownable {
    TokenInterface public token;
    NFTInterface public nft;
    TheMetaSheetInterface public TheMetaSheet;
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
            address(TheMetaSheet) == address(0),
            "DAOEngine: Engine is already acquired"
        );
        require(
            address(_TheMetaSheet) != address(0),
            "DAOEngine: invalid address"
        );
        TheMetaSheet = TheMetaSheetInterface(_TheMetaSheet);
        token = TokenInterface(TheMetaSheet.token());
        nft = NFTInterface(TheMetaSheet.nft());
    }
}
