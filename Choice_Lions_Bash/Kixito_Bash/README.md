# Creating and deploying an NFT 

### TECHNOLOGIES USED

1. REMIX (http://remix.ethereum.org/) for compiling our code

2. EVM (Ethereum Virtual Machine) Testnet Blockchain network

3. Pinata

4. Pragma Solidity

5. Ethereum JavaScript API  (web3.js)

### BUILD STEPS

1. Upload image and json file to pinata
    Upload the folder that contains all of your images
    After the folder is uploaded in Pinata a CID is created

2. Copy the CID and paste it in your JSON file. The JSON folder CID will be used in the Solidity smart contract.

3. Creating and deploying a Solidity ERC721 smart contract for our NFT
    The ERC721 smart contract imports Open Zeppelin’s ERC721 and Strings contracts. Two functions were added to the contract (Mint and TokenURI)

IPFS IMAGE - https://ipfs.io/ipfs/QmSNFrWXMcwkHhXeLXeC7RVvxPo11pqi8MYHCX28Th3kA4