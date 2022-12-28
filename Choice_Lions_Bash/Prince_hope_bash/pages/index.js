import { useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { useEthers } from "@usedapp/core";

import Head from "next/head";
const Home = () => {
  const [name, setName] = useState("default");
  const [key, setKey] = useState("defaultVal");
  const [bool, setBool] = useState("0x0");

  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address", address);

  const signer = provider ? provider.getSigner() : undefined;

  if (!address) {
    return (
      <div className="landing">
        Welcome!!!, Please mint an NFT
        <button onClick={() => connectWallet("injected")} className="btn-hero">
         Welcome Connect Your Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Proposal</title>
        <meta
          name="description"
          content="This Page Contains a Proposal for Coin Voting Platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <input type="text" onChange={(e) => setKey(e.target.value)} />
        <input type="file" onChange={_=>setBool(true)} >insert image</input>
      </form>

{bool &&      <MintButton keyVal={key} name={name} address={address} />
}    </div>
  );
};
// A React component to render all nfts from the nft collection.
const RenderAllNFTComponent = () => {
  // React state for a list of nfts in the nft collection
  const [nfts, setNFTs] = useState([]);

  // get the web3 library from your installed web3 react library from step (2)
  const { library } = useEthers();

  useEffect(() => {
    // initialize the SDK and get the NFT Collection module
    // get the contract address (0x...) from your dashboard!
    const nft = new ThirdwebSDK(library?.getSigner()).getNFTModule(
      "0x10a369CbBB59Fa4332F5D56059F7B30f45A9D10a"
    );

    // get all the NFTs including the owner from the nft collection.
    // Note: you can use async/await too!
    nft.getAllWithOwner().then((allNFTs) => setNFTs(allNFTs));
  }, [library]);

  // render the list of nfts
  return (
    <>
      {nfts.map((nft) => (
        <p>Token Id: {nft.id}</p>
      ))}
    </>
  );
};

// A React component of mint button that makes a backend server request.
const MintButton = ({ name, keyVal, address }) => {
  // get the connected wallet address from your installed web3 react library from step (2)

  // const { account } = useEthers();

  const onMintHandler = async () => {
    // make a backend server api request to mint an NFT
    // console.log(NftURL);
    await fetch("/api/v1/mint", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ account: address || "default", name, keyVal }),
    });
  };

  // render the button to mint a sword NFT
  return <button onClick={onMintHandler}>Mint Sword NFT</button>;
};

//imports needed for this function

export default Home;
