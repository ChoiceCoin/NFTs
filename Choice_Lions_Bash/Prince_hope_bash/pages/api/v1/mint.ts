import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

// This depend on your HTTP Server setup. In this example, we're using next.js
// api handlers.
export default function mint(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append("file", fs.createReadStream("./pic.png"));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
      name: req.body.name,
      keyvalues: {
        exampleKey: req.body.key,
      },
    });
    data.append("pinataMetadata", metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
      customPinPolicy: {
        regions: [
          {
            id: "FRA1",
            desiredReplicationCount: 1,
          },
          {
            id: "NYC1",
            desiredReplicationCount: 2,
          },
        ],
      },
    });
    data.append("pinataOptions", pinataOptions);

    return axios
      .post(url, data, {
        maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      })
      .then(function (response) {
        console.log("response", response);
        return response;
        //handle response here
      })
      .catch(function (error) {
        console.error("failed to pin", error)
      });
  };
  // the RPC URL to the blockchain that the NFT contract is deployed on.
  // "rinkeby" = rinkeby testnet,
  // "https://rpc-mumbai.maticvigil.com" = mumbai testnet.
  const rpcUrl = "rinkeby";

  // setup a wallet using private key for the SDK.
  // the wallet must have MINTER role to mint the NFT.
  // you can assign MINTER role to the wallet through the NFT collection dashboard.
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(rpcUrl)
  );

  // initialize the SDK and get the NFT Collection module
  // get the contract address (0x...) from your dashboard!
  console.log("request body",req.body);
  const nft = new ThirdwebSDK(wallet).getNFTModule(
    "0x755027140529F8EeCf47622bfb01ec90A9B33bB1"
  );

  // get the wallet address that's sent in from the request body.
  const { account, name, keyVal } = req.body;

  // returning the HTTP response. This depends on the HTTP server framework.
  return new Promise<void>(async (resolve) => {
    const NftURL = await pinFileToIPFS(process.env.API_KEY, process.env.API_SECRET)
   console.log("Successfully uploaded to ifps ==> Nft url",NftURL)
const {data} = NftURL
        // mint "My Sword" NFT to the wallet address that was requested.
        // note: async / await works too.
      return nft
        .mintTo(account, {
          name: name,
          description: keyVal,
          image:`ipfs://${data.IpfsHash}`,
        })

        .then((metadata) => {
          // Returning the NFT metadata to the client requested.
          // This depends on the HTTP server framework
          res.status(200).json(metadata);
          resolve();
        })

        .catch((ERR) => console.error("Failed to upload", ERR));
  });
}
