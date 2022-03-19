async function main() {
    // We get the contract to deploy
    const { ethers } = require("hardhat");
    const choice = await ethers.getContractFactory("choice");
    const CHOICE = await choice.deploy();
  
    console.log("Choice deployed to:", CHOICE.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });