pragma solidity ^0.8.0;
import "./Token.sol";

contract MetaSheetDAO {
    Token public token;

    constructor() {
        token = new Token(
            "The Meta Sheet Token",
            "TMST",
            address(this),
            1000000
        );
    }
}
