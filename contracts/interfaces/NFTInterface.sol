pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface NFTInterface is IERC721 {
    function transferOwnership(address newOwner) external;
}
