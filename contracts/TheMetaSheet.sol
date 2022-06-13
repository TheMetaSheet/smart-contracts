//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/NFTInterface.sol";

contract TheMetaSheet {
    NFTInterface public nft;

    constructor(address nftAddress) {
        require(nftAddress != address(0), "invalid NFT address");
        nft = NFTInterface(nftAddress);
    }
    
    function getNFTAddress() public view returns (address) {
        return address(nft);
    }
}
