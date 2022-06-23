//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/NFTInterface.sol";
import "./interfaces/TokenInterface.sol";

contract TheMetaSheet {
    NFTInterface public nft;
    TokenInterface public token;

    constructor(address nftAddress, address tokenAddress) {
        require(nftAddress != address(0), "invalid NFT address");
        require(tokenAddress != address(0), "invalid Token address");
        nft = NFTInterface(nftAddress);
    }
    
    function getNFTAddress() public view returns (address) {
        return address(nft);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }
}
