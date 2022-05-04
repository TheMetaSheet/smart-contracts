pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TokenInterface.sol";
import "./NFTInterface.sol";

interface TheMetaSheetInterface {
    function transferOwnership(address newOwner) external;

    function token() external view returns (TokenInterface token);

    function nft() external view returns (NFTInterface nft);
}
