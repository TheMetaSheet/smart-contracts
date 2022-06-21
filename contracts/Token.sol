//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public admin;

    constructor( string memory name, string memory symbol, address admin_, uint256 totelSupply
    ) ERC20(name, symbol) {
        _mint(admin_, totelSupply * 10**18);
        admin = admin_;
    }
}