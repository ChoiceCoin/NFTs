const algosdk = require("algosdk");
const crypto = require("crypto");
const fs = require("fs");
const { createAccount, waitForConfirmation, keypress } = require("./helper");

const createAsset = async (algodClient, creator) => {
  console.log("");
  console.log("==> ASSET CREATION...");
  //Check account balance
  const accountInfo = await algodClient.accountInformation(creator.addr).do();
  const startingAmount = accountInfo.amount;
  console.log(`Creator's account balance: ${startingAmount} microAlgos" `);

  // Construct the transaction
  const params = await algodClient.getTransactionParams().do();

  //variables definition
  const defaultFrozen = false; // Whether user accounts will need to be unfrozen before transacting
  const unitName = "CHOICE"; // Used to display asset units to user
  const assetName = "Choice's NFT@arc3"; // Friendly name of the asset
  // Optional string pointing to a URL relating to the asset
  const url = "https://jsonkeeper.com/b/R4AX";
  // OPTIONAL: FOR DEMO ONLY, USED TO DESTROY ASSET WITHIN
  // Specified address is considered the asset reserve
  // (it has no special privileges, this is only informational)
  const managerAddr =
    "ZU7NJ2X2XNELIGJBUW57PETCEK4HXHL2FJKOP2DRRWWBYH2B2JPI2WDA34";
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;

  const total = 1; // NFTs have totalIssuance of exactly 1
  const decimals = 0; // NFTs have decimals of exactly 0

  // temp fix for replit
  const fullPath = __dirname + "/NFT/metadata.json";
  const metadatafile = await fs.readFileSync(fullPath);
  const hash = crypto.createHash("sha256");
  hash.update(metadatafile);

  const metadata = "16efaa3924a6fd9d3a4824799a4ac65d";

  const fullPathImage = __dirname + "/NFT/ChoiceNFT.png";
  const metadatafileImage = await fs.readFileSync(fullPathImage);

  const hashImage = crypto.createHash("sha256");
  hashImage.update(metadatafileImage);
  const hashImageBase64 = hashImage.digest("base64");
  const imageIntegrity = "sha256-" + hashImageBase64;

  // use this in yout metadata.json file
  console.log("image_integrity : " + imageIntegrity);

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    assetMetadataHash: metadata,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });

  const rawSignedTxn = txn.signTxn(creator.sk);
  const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
  let assetID = null;
  // wait for transaction to be confirmed
  const confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
  //Get the completed Transaction
  console.log(
    "Transaction " +
      tx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
  let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx["asset-index"];
  // console.log("AssetID = " + assetID);

  await printCreatedAsset(algodClient, creator.addr, assetID);
  await printAssetHolding(algodClient, creator.addr, assetID);
  console.log(">>>>>>>>>>>>.......", { assetID });
  return { assetID };
};

// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodClient, account, assetid) {
  // note: if you have an indexer instance available it is easier to just use this
  //     let accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  let accountInfo = await algodClient.accountInformation(account).do();
  for (idx = 0; idx < accountInfo["created-assets"].length; idx++) {
    let scrutinizedAsset = accountInfo["created-assets"][idx];
    if (scrutinizedAsset["index"] == assetid) {
      console.log("AssetID = " + scrutinizedAsset["index"]);
      let myparms = JSON.stringify(scrutinizedAsset["params"], undefined, 2);
      console.log("parms = " + myparms);
      break;
    }
  }
};

// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodClient, account, assetid) {
  let accountInfo = await algodClient.accountInformation(account).do();
  for (idx = 0; idx < accountInfo["assets"].length; idx++) {
    let scrutinizedAsset = accountInfo["assets"][idx];
    if (scrutinizedAsset["asset-id"] == assetid) {
      let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log("assetholdinginfo = " + myassetholding);
      break;
    }
  }
};

async function createNFT() {
  try {
    let creator = createAccount();
    console.log("Press any key when the account is funded");
    await keypress();
    const algodToken =
      "2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b";
    const algodServer = "https://academy-algod.dev.aws.algodev.network";
    const algodPort = 443;

    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // CREATE ASSET
    const { assetID } = await createAsset(algodClient, creator);

    // DESTROY ASSET
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
}

createNFT();
