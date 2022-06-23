//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is Ownable, ERC20 {
    address public admin;
    mapping(uint256 => address) public userWallets;

    constructor(
        string memory name_,
        string memory symbol_,
        address admin_,
        uint256 totelSupply_
    ) ERC20(name_, symbol_) {
        _mint(admin_, totelSupply_ * 10**18);
        admin = admin_;
    }
}
