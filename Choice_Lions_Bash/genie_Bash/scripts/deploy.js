async function main() {
    const NFT = await ethers.getContractFactory("NFT");

    // Start deployment, returning a promise that resolves to a contract object
    const Nft = await NFT.deploy();
    console.log("Contract deployed to address:", Nft.address);
    }

    main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });