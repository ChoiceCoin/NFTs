/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
    solidity: "0.8.6",
    settings: {
        optimizer: {
            enabled: true,
            runs: 1000000,
        },
    },
    mocha: {
        timeout: 90000
    },
    networks: {
        palm_testnet: {
            url: `https://ropsten.infura.io/v3/9ef2982359be41d2aa4b56de2db58494`,
            accounts: [`0x` + process.env.PRIVATE_KEY],
            gasPrice: 1000
        },
        palm_mainnet: {
            url: `https://mainnet.infura.io/v3/9ef2982359be41d2aa4b56de2db58494`,
            accounts: [`0x` + process.env.PRIVATE_KEY],
            gasPrice: 1000
        }
    }
};