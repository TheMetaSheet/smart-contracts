pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private maxRow = 50;
    uint256 private maxCol = 50;

    constructor() ERC721("TheMetaSheet", "TMS") public {

    }

    // A 1 = A1 
    function mint(string memory col, uint256 row) public returns (uint256){
        bytes memory colBytes = bytes(col);
        uint256 colLength = colBytes.length;
        // uint256[] memory numbers = new uint256[](colLength);

        // for(uint256 i = 0; i < colLength; i++){
        //     numbers[i] = uint8(colBytes[i]);
        // }

        uint256 index = 0;
        for(uint256 i = 0; i < colLength; i++){
            index = uint8(colBytes[i]) - 64 + 26 * index;
        }
    }

    function excelLabelToIndex(string memory label) public view returns (uint256) {
        bytes memory colBytes = bytes(label);
        uint256 colLength = colBytes.length;
        uint256 index = 0;

        for(uint256 i = 0; i < colLength; i++){




            index = uint8(colBytes[i]) - 64 + 26 * index;
        }
        return index;
    }
}