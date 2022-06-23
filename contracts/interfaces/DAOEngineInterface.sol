//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface DAOEngineInterface {
    function transferOwnership(address newOwner) external;

    function acquire(address _TheMetaSheet) external;

    function lock() external;
}
