const algosdk = require("algosdk");
const crypto = require("crypto");
const fs = require("fs");
const defaultFrozen = false;
const unitName = "EZE";
const assetName = "EZEMUO";
const url =
  "https://gateway.pinata.cloud/ipfs/QmXaTNVAgr51GpJqSEiUxZAFXuEFNCSMiz4ukrAjhRuiFP?preview=1";
const managerAddr =
  "XVNO7SYNSKPSUDBHPXZI47CXQXAEYOK2IF33RJDDJFQFMUSKFVW72RBUQU";
const reserveAddr = undefined;
const freezeAddr = undefined;
const clawbackAddr = undefined;
const metadata = undefined;
const total = 1;
const decimals = 0;
const waitForConfirmation = async function (algodClient, txId, timeout) {
  if (algodClient == null || txId == null || timeout < 0) {
    throw new Error("Bad arguments");
  }

  const status = await algodClient.status().do();
  if (status === undefined) {
    throw new Error("Unable to get node status");
  }

  const startround = status["last-round"] + 1;
  let currentround = startround;

  while (currentround < startround + timeout) {
    const pendingInfo = await algodClient
      .pendingTransactionInformation(txId)
      .do();
    if (pendingInfo !== undefined) {
      if (
        pendingInfo["confirmed-round"] !== null &&
        pendingInfo["confirmed-round"] > 0
      ) {
        //Got the completed Transaction
        return pendingInfo;
      } else {
        if (
          pendingInfo["pool-error"] != null &&
          pendingInfo["pool-error"].length > 0
        ) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error(
            "Transaction " +
              txId +
              " rejected - pool error: " +
              pendingInfo["pool-error"]
          );
        }
      }
    }
    await algodClient.statusAfterBlock(currentround).do();
    currentround++;
  }
  throw new Error(
    "Transaction " + txId + " not confirmed after " + timeout + " rounds!"
  );
};
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
async function createAsset(algodClient, ife) {
  console.log("");
  console.log("==> CREATE ASSET");
  //Check account balance
  const accountInfo = await algodClient.accountInformation(ife.addr).do();
  const startingAmount = accountInfo.amount;
  console.log("Samuel account balance: %d microAlgos", startingAmount);

  // Construct the transaction
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: ife.addr,
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

  const rawSignedTxn = txn.signTxn(ife.sk);
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

  await printCreatedAsset(algodClient, ife.addr, assetID);
  await printAssetHolding(algodClient, ife.addr, assetID);

  return { assetID };
}
const createAccount = function () {
  try {
    // let account1_mnemonic = "goat march toilet hope fan federal around nut drip island tooth mango table deal diesel reform lecture warrior tent volcano able wheel marriage absorb minimum";
    // const myaccount = algosdk.mnemonicToSecretKey(account1_mnemonic);
    const myaccount = algosdk.generateAccount();
    console.log("Account Address = " + myaccount.addr);
    let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
    console.log("Account Mnemonic = " + account_mnemonic);
    console.log("Account created. Save off Mnemonic and address");
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log(
      "https://dispenser.testnet.aws.algodev.network/?account=" + myaccount.addr
    );

    return myaccount;
  } catch (err) {
    console.log("err", err);
  }
};

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

async function createNFT() {
  try {
    let ife = createAccount();
    console.log("Press any key when the account is funded");
    await keypress();
    const algodToken =
      "2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b";
    const algodServer = "https://academy-algod.dev.aws.algodev.network";
    const algodPort = 443;

    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // CREATE ASSET
    const { assetID } = await createAsset(algodClient, ife);
    // DESTROY ASSET
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
}
createNFT();
