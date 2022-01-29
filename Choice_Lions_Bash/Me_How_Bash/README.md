# Minting and Selling Nfts on Rarible using Ipfs

The repo contains a basic web3 app on how to mint your own Nfts .

### Technology used in this project
> Web3.js
> Bootstrape cdn
> font awesome cdn
> Moralis

### Running this project

```sh

git clone <this repo >

```

Setup you Moralis Account to get your AppId and ServerUrl Key 
 
On your Moralis Server, install rerible plugin

Start the app with liveServer


### Configuration

To mint an Nft you have to edit the configurations located in __main.js__ to use a serverUrl and the appid. 

```javascript
/** Connect to Moralis server */
const serverUrl = "INSERT SERVER_URL";
const appId = "INSERT APP_ID";
Moralis.start({ serverUrl, appId });

```
