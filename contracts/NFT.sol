// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private maxRow = 50;
    uint256 private maxCol = 50;
    mapping(string => mapping(uint256 => uint256) ) public nfts;

    constructor() ERC721("TheMetaSheet", "TMS") {
        console.log("NTF constructor");
    }

    function mint(string memory col, uint256 row) public returns (uint256) {
        uint256 colIndex = excelLabelToIndex(col);
        require(colIndex > 0 && colIndex <= maxRow, "Invalid col");
        require(row > 0 && row <= maxRow, "Invalid row");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        nfts[col][row] = newItemId;

        return (newItemId);
    }

    function getNFTsByAddress(address owner) public view returns(uint256[] memory) {
        uint256 numberOfToken = balanceOf(owner);
        uint256[] memory tokens = new uint256[](numberOfToken);
        for(uint256 i = 0; i < numberOfToken; i++ ){
            uint256 token = tokenOfOwnerByIndex(owner, i);
            tokens[i] = token;
        }
        return tokens;
    }

    function excelLabelToIndex(string memory label) public pure returns (uint256) {
        bytes memory colBytes = bytes(label);
        uint256 colLength = colBytes.length;
        uint256 index = 0;

        for(uint256 i = 0; i < colLength; i++){
            uint8 char = uint8(colBytes[i]);
            require(char >= 65 && char <= 65 + 26, "Invalid char for label");
            index = char - 64 + 26 * index;
        }
        return index;
    }

    function getNFTbyColAndRowNumber(string memory col, uint256 row) public view returns (uint256){
        uint256 token = nfts[col][row];
        return (token);
    }
}
