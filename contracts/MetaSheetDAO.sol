pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";

import "./DAOEngine.sol";

contract MetaSheetDAO {
    TokenInterface public token;
    NFTInterface public nft;
    DAOEngine public daoEngine;

    function setToken(address tokenAddress) public {
        require(address(token) == address(0), "Token is already set");
        token = TokenInterface(tokenAddress);
    }

    function setNFT(address nftAddress) public {
        nft = NFTInterface(nftAddress);
    }

    function createDAOEngine() public {
        daoEngine = new DAOEngine(token, nft);
    }

    function getNFTAddress() public view returns (address) {
        return address(nft);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function getDAOEngineAddress() public view returns (address) {
        return address(daoEngine);
    }
}
