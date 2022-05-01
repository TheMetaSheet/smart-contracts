pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface DAOEngineInterface {
    function transferOwnership(address newOwner) external;

    function acquire(address _metaSheetDAO) external;

    function lock() external;
}
