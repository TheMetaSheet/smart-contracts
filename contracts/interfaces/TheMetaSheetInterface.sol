//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TokenInterface.sol";
import "./NFTInterface.sol";

interface TheMetaSheetInterface {
    function transferOwnership(address newOwner) external;

    function getTokenAddress() external view returns (TokenInterface token);

    function getNFTAddress() external view returns (NFTInterface nft);
}