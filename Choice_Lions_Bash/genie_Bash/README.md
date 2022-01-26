#   CREATING, DEPLOYING AND MINTING AN NFT 

##  TECHNOLOGIES USED

1. PALM NETWORK
2. INFURA ENDPOINT (ETHEREUM NETWORK)
3. METAMASK
4. NODE.JS
5. HARDHAT
6. ETHERS.JS (An Ethereum library for deploying NFT smart contracts)
7. OPENZEPPELIN

### RUN/BUILD STEPS

1. Initialize your npm project
    `npm init --yes`

2. Install HardHat
    `npm install --save-dev hardhat`

3. Create a New HardHat project
    `npx hardhat`
    Make sure you select 'create an empty hardhat.config.js'

4.  Add Project folders (contracts and scripts)

5. Write your contract using a contract based on the OpenZeppelin library. 
    (cd inside contracts/NFT.sol for an overview)

6. Set Environment Variables.
    Create a `.env` file in the root directory

7. Edit `hardhat.config.js`

8. Compile the Contract 
    `npx hardhat compile`

9. Write a Deploy Script and deploy it. 
    In this case, cd into scripts/deploy.js 
    Run the command with `npx hardhat run scripts/deploy.js --network palm_testnet`


NFT IMAGE ON PINATA - https://gateway.pinata.cloud/ipfs//QmTXCxm6JgR8vSnHYEr2coismbS9H74eh5evi7brT3hRSY

NFT METADATA ON PINATA - https://gateway.pinata.cloud/ipfs//QmYDj4JwE5LYYgbMJGHemzH3UwpP2sTFQqo4wBjbCGhnWn

CONTRACT ADDRESS - 0x5970B7524A441B904666C5e55c76BB90Df8bea71

YOUTUBE LINK TO VIDEO DEMO - https://youtu.be/WaTrRBjdsxo

