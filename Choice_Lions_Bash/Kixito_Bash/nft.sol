pragma solidity ^0.8.2;

//import Open Zepplin contracts
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

contract NFT is ERC721 {
    uint256 private _tokenIds;
    
    constructor() ERC721("Name", "Symbol") {}
        // SPDX-License-Identifier: <SPDX-License>
//use the mint function to create an NFT
    function mint()
    public
    returns (uint256)
    {
        _tokenIds += 1;
        _mint(msg.sender, _tokenIds);
        return _tokenIds;
    }
    
//in the function below include the CID of the JSON folder on IPFS
    function tokenURI(uint256 _tokenId) override public pure returns(string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/QmSNFrWXMcwkHhXeLXeC7RVvxPo11pqi8MYHCX28Th3kA4",
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }
}

uint256 public mintingFee = 20000000000000000;

    //add a function to change the state variable
    function setMintingFee(uint256 _fee) public onlyOwner {
        mintingFee = _fee;
    
    //add a require statement to the mint function
    require(mintingFee <= msg.value, "Not Enough Ether To Mint");