pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.05 ether;
    string public notRevealedUri;
    uint256 public maxCol = 100;
    uint256 public maxRow = 100;

    struct Cell {
        string columnName;
        uint256 rowNumber;
    }

    mapping(string => bool) mintedCell;
    mapping(uint256 => Cell) cells;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function colNameToNumber(string memory col) public pure returns (uint256) {
        bytes memory letters = bytes(col);
        uint256 n = 0;
        uint8 A = uint8(bytes("A")[0]);
        uint8 Z = uint8(bytes("Z")[0]);
        for (uint256 p = 0; p < letters.length; p++) {
            uint8 charCode = uint8(letters[p]);
            if ((charCode > A - 1 && charCode < Z + 1) == false) {
                return 0;
            }
            n = charCode - 64 + n * 26;
        }
        return n;
    }

    function numberToColName(uint256 _col) public pure returns (string memory) {
        uint256 col = _col - 1;
        uint8 A = uint8(bytes("A")[0]);
        uint8 Z = uint8(bytes("Z")[0]);
        uint8 len = Z - A + 1;

        uint256 num = 26;
        uint256 count = 1;

        while (num <= col) {
            num = num * 26;
            count++;
        }

        num = col;
        bytes memory str = new bytes(count);
        count = 0;
        while (num >= 0) {
            str[str.length - 1 - count] = bytes1(uint8((num % len)) + A);
            if (num / len <= 0) {
                break;
            }
            num = uint256(num / len);
            num = num - 1;
            count++;
        }

        return string(str);
    }

    function mintCell(string memory columnName, uint256 rowNumber) private {
        string memory cellName = string(
            abi.encodePacked(columnName, Strings.toString(rowNumber))
        );
        require(mintedCell[cellName] == false, "this cell is already minted");
        mintedCell[columnName] = true;
        uint256 supply = totalSupply();
        uint256 mintId = supply + 1;
        cells[mintId] = Cell(columnName, rowNumber);
        _safeMint(
            msg.sender,
            mintId,
            abi.encodePacked(
                columnName,
                Strings.toString(rowNumber),
                Strings.toString(supply)
            )
        );
    }

    function mintByColumnNumberAndRowNumber(
        uint256 columnNumber,
        uint256 rowNumber
    ) public payable {
        require(
            columnNumber > 0,
            "invalid column number. it shoulbe greater than zero"
        );
        require(
            rowNumber > 0,
            "invalid row number. it shoulbe greater than zero"
        );
        require(
            columnNumber <= maxCol,
            string(
                abi.encodePacked(
                    "overflow max column. it can be maximum up to",
                    Strings.toString(maxCol)
                )
            )
        );
        require(
            rowNumber <= maxRow,
            string(
                abi.encodePacked(
                    "overflow max row. it can be maximum up to",
                    Strings.toString(maxRow)
                )
            )
        );
        if (msg.sender != owner())
            require(msg.value >= cost, "required more eth to mint");
        mintCell(numberToColName(columnNumber), rowNumber);
    }

    function mintByColumnNameAndRowNumber(
        string memory columnName,
        uint256 rowNumber
    ) public payable {
        uint256 columnNumber = colNameToNumber(columnName);
        require(columnNumber > 0, "invalid column number");
        require(
            columnNumber <= maxCol,
            string(
                abi.encodePacked(
                    "overflow max column. it can be maximum ",
                    numberToColName(maxCol),
                    "(",
                    Strings.toString(maxCol),
                    ")"
                )
            )
        );
        require(
            rowNumber > 0,
            "invalid row number. it shoulbe greater than zero"
        );
        if (msg.sender != owner())
            require(msg.value >= cost, "required more eth to mint");
        mintCell(columnName, rowNumber);
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (string[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        string[] memory tokenIds = new string[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            Cell memory cell = cells[tokenOfOwnerByIndex(_owner, i)];
            tokenIds[i] = string(
                abi.encodePacked(
                    cell.columnName,
                    Strings.toString(cell.rowNumber)
                )
            );
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setMaxColAndRow(uint256 _maxCol, uint256 _maxRow)
        public
        onlyOwner
    {
        require(_maxCol > maxCol);
        require(_maxRow > maxRow);
        maxCol = _maxCol;
        maxRow = _maxRow;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function withdraw() public payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
