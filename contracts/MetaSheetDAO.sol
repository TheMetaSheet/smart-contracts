pragma solidity ^0.8.0;

import "./interfaces/TokenInterface.sol";
import "./interfaces/NFTInterface.sol";
import "./interfaces/DAOEngine.sol";

contract MetaSheetDAO {
    TokenInterface public token;
    NFTInterface public nft;
    DAOEngineInterface[] public daoEngines;

    function setToken(address tokenAddress) public {
        require(tokenAddress != address(0), "invalid address");
        require(address(token) == address(0), "Token is already set");
        token = TokenInterface(tokenAddress);
    }

    function setNFT(address nftAddress) public {
        require(nftAddress != address(0), "invalid address");
        require(address(nft) == address(0), "NFt is already set");
        nft = NFTInterface(nftAddress);
    }

    function setDAOEngine(address _daoEngineAddress) public {
        require(_daoEngineAddress != address(0), "invalid address");
        for (uint256 index = 0; index < daoEngines.length; index++) {
            require(
                address(daoEngines[index]) != _daoEngineAddress,
                "Can not set used daoEngine"
            );
        }
        if (daoEngines.length != 0) {
            daoEngines[daoEngines.length - 1].lock();
        }
        DAOEngineInterface daoEngine = DAOEngineInterface(_daoEngineAddress);
        daoEngine.acquire(address(this));
        daoEngines.push(daoEngine);
    }

    function getNFTAddress() public view returns (address) {
        return address(nft);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function getDAOEngineAddress() public view returns (address) {
        return address(daoEngines[daoEngines.length - 1]);
    }
}
