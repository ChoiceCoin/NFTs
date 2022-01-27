require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const contract = require("../artifacts/contracts/NFT.sol/NFT.json");
const contractInterface = contract.abi;

// https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#provider-object
let provider = ethers.provider;

const tokenURI = "https://gateway.pinata.cloud/ipfs//QmYDj4JwE5LYYgbMJGHemzH3UwpP2sTFQqo4wBjbCGhnWn";
const privateKey = `0x${process.env.PRIVATE_KEY}`;
const wallet = new ethers.Wallet(privateKey);

wallet.provider = provider;
const signer = wallet.connect(provider);

// https://docs.ethers.io/v5/api/contract/contract
const nft = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractInterface,
  signer
);

const main = () => {
  console.log("Waiting 5 blocks for confirmation...");
  nft
    .mintNFT(process.env.PUBLIC_KEY, tokenURI)
    .then((tx) => tx.wait(5))
    .then((receipt) => console.log(`Your transaction is confirmed, its receipt is: ${receipt.transactionHash}`))

    .catch((e) => console.log("something went wrong", e));
};

main();