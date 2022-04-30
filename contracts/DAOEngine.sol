pragma solidity ^0.8.0;

import "./Token.sol";
import "./NFT.sol";

contract DAOEngine {
    Token public token;
    NFT public nft;

    constructor(Token _token, NFT _nft) {
        token = _token;
        nft = _nft;
    }
}
