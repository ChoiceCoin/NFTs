# Choice <> Lions NFT Bash

## Creating, Deploying and Minting NFT contract on ERC -721 

   ### TECHNOLOGIES USED

1. ALCHEMY
2. HARDHAT
3. SOLIDITY
4. METAMASK
5. PINATA
6. ALCHEMY MEMPOOL


    ### REQUIREMENTS
1. METAMASK EXTENSION ON CHROME BROWSER
2. ALCHEMY (SIGN UP TO CREATE AN APPLICATION)
3. PRIVATE_KEY FROM YOUR METAMASK WALLET
4. ROPSTEN TEST NETWORK ENABLED IN YOUR METAMASK
5. ON YOUR ALCHEMY DASHBOARD
    Click on application and view key(copy the http enabled key)
6. COPY AND PASTE YOUR ALCHEMY URL AND SECRET KEY(METAMASK) on the .env file

    ### DEPENDENCIES

1. npm init
2. npm install --save-dev hardhat
3. npx hardhat
4. npm install dotenv --save
5. npm install --save-dev @nomiclabs/hardhat-ethers
6. npx hardhat compile
7. npm install @alch/alchemy-web3

    ### RUN STEPS

1. `git clone ` this repository
2. Using a code editor (VS CODE preferably)
3. Install DEPENDECIES
4. npx hardhat --network ropsten run scripts/deploy.js
    This is actually deploying our NFT and you can view the contract address


5. TO MINT THE NFT,  RUN `node scripts/mint-nft.js`
    This would mint the NFT in your scripts folder. 

### HOW TO VIEW YOUR NFT IN YOUR WALLET

1. SET YOUR NETWORK TO ROPSTEN
2. ADD YOUR COLLECTABLE TO METAMASK
        Once you’re on the Ropsten network, select the “Collectibles” tab on the right and add the NFT smart contract address and the ERC-721 token ID of your NFT — which you should be able to find on Etherscan based on the transaction hash from your NFT deployed
3. REFRESH YOUR WALLET

YOUTUBE VIDEO LINK ----->>>>    https://youtu.be/YgoBZT5bCCw