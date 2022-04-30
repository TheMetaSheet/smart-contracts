pragma solidity ^0.8.0;

import "./Token.sol";
import "./NFT.sol";
import "./DAOEngine.sol";

contract MetaSheetDAO {
    Token public token;
    NFT public nft;
    DAOEngine public daoEngine;

    constructor() {
        token = new Token(
            "The Meta Sheet Token",
            "TMST",
            address(this),
            (1000000000 * 10**18)
        );
        daoEngine = new DAOEngine(token);
    }
}
