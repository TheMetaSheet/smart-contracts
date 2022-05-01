pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";

contract DAOEngine {
    TokenInterface public token;
    NFTInterface public nft;

    constructor(TokenInterface _token, NFTInterface _nft) {
        token = _token;
        nft = _nft;
    }
}
