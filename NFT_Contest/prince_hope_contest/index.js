const algosdk = require('algosdk');
const crypto = require('crypto');
const fs = require('fs');
//const fs = require('fs/promises');
// see ASA param conventions here: https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0003.md
// for JavaScript SDK doc see: https://algorand.github.io/js-algorand-sdk/

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

// https://dispenser.testnet.aws.algodev.network/

const DISPENSERACCOUNT = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
async function createAsset(algodClient, Prince) {
    console.log("");
    console.log("==> CREATE ASSET");
    //Check account balance   
    const accountInfo = await algodClient.accountInformation(Prince.addr).do();
    const startingAmount = accountInfo.amount;
    console.log("Prince account balance: %d microAlgos", startingAmount);

    // Construct the transaction
    const params = await algodClient.getTransactionParams().do();

    // Whether user accounts will need to be unfrozen before transacting    
    const defaultFrozen = false;
    // Used to display asset units to user    
    const unitName = "GCE";
    // Friendly name of the asset    
    const assetName = "Global Choice Extension";
    // Optional string pointing to a URL relating to the asset
    const url = "https://jsonkeeper.com/b/481K";

    const managerAddr = Prince.addr; // OPTIONAL: FOR DEMO ONLY, USED TO DESTROY ASSET WITHIN
    // Specified address is considered the asset reserve
    // (it has no special privileges, this is only informational)
    const reserveAddr =
      "RWXX2OACYFWOH7JKS5W6HLFDXUC6GLI6MYUJTAQ5B4VH6ZFS5LQSS6MJ2I"; 
    // Specified address can freeze or unfreeze user asset holdings   
    const freezeAddr =
      "RWXX2OACYFWOH7JKS5W6HLFDXUC6GLI6MYUJTAQ5B4VH6ZFS5LQSS6MJ2I";
    // Specified address can revoke user asset holdings and send 
    // them to other addresses    
    const clawbackAddr =
      "RWXX2OACYFWOH7JKS5W6HLFDXUC6GLI6MYUJTAQ5B4VH6ZFS5LQSS6MJ2I";
    
    const decimals = 0; 
    const total = 1; // how many of this asset there will be

    // temp fix for replit    
    //const metadata2 = "16efaa3924a6fd9d3a4824799a4ac65d";
    const fullPath =  __dirname + '/NFT/metadata.json'; 
    //const metadatafile = (await fs.readFileSync(fullPath));
    const metadatafile = (await fs.readFileSync(fullPath));
    const hash = crypto.createHash('sha256');
    hash.update(metadatafile);

   
    const metadata = "16efaa3924a6fd9d3a4824799a4ac65d";


    const fullPathImage =  __dirname + '/NFT/Choice.mp4'; 
    const metadatafileImage = (await fs.readFileSync(fullPathImage));
//    const metadatafileImage = (await fs.readFileSync(fullPathImage)).toString();    
    const hashImage = crypto.createHash('sha256');
    hashImage.update(metadatafileImage);
    const hashImageBase64 = hashImage.digest("base64");
    const imageIntegrity = "sha256-" + hashImageBase64;
    
    // use this in yout metadata.json file
    console.log("image_integrity : " + imageIntegrity);


    // signing and sending "txn" allows "addr" to create an asset 
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: Prince.addr,
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
        suggestedParams: params,});

    const rawSignedTxn = txn.signTxn(Prince.sk);
    const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
    let assetID = null;
    // wait for transaction to be confirmed
    const confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    const ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
    assetID = ptx["asset-index"];
    // console.log("AssetID = " + assetID);

    await printCreatedAsset(algodClient, Prince.addr, assetID);
    await printAssetHolding(algodClient, Prince.addr, assetID);
    console.log("You can verify the metadata-hash above in the asset creation details");
    console.log("Using terminal the Metadata hash should appear as identical to the output of");
    console.log("cat PrinceAssetMetaData.json | openssl dgst -sha256 -binary | openssl base64 -A");
    console.log("That is: Cii04FOHWE4NiXQ4s4J02we2gnJop5dOfdkBvUoGHQ8=");

    return { assetID };
 
    
    AssetID = 28291127
  
}

async function destroyAsset(algodClient, Prince, assetID) {
    console.log("");
    console.log("==> DESTROY ASSET");
    // All of the created assets should now be back in the creators
    // Account so we can delete the asset.
    // If this is not the case the asset deletion will fail
    const params = await algodClient.getTransactionParams().do();
    // Comment out the next two lines to use suggested fee
    // params.fee = 1000;
    // params.flatFee = true;
    // The address for the from field must be the manager account
    const addr = Prince.addr;
    // if all assets are held by the asset creator,
    // the asset creator can sign and issue "txn" to remove the asset from the ledger. 
    const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        from: addr, 
        note: undefined, 
        assetIndex: assetID, 
        suggestedParams: params
    });
    // The transaction must be signed by the manager which 
    // is currently set to Prince
    const rawSignedTxn = txn.signTxn(Prince.sk);
    const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
    // Wait for confirmation
    const confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    // The account3 and account1 should no longer contain the asset as it has been destroyed
    console.log("Asset ID: " + assetID);
    console.log("Prince = " + Prince.addr);
    await printCreatedAsset(algodClient, Prince.addr, assetID);
    await printAssetHolding(algodClient, Prince.addr, assetID);

    return;
 
}
async function closeoutPrinceAlgos(algodClient, Prince) {
    console.log("");
    console.log("==> CLOSE OUT Prince'S ALGOS TO DISPENSER");
    let accountInfo = await algodClient.accountInformation(Prince.addr).do();
    console.log("Prince Account balance: %d microAlgos", accountInfo.amount);
    const startingAmount = accountInfo.amount;
    // Construct the transaction
    const params = await algodClient.getTransactionParams().do();
    // comment out the next two lines to use suggested fee
    // params.fee = 1000;
    // params.flatFee = true;
    // For more info see: 
    // https://developer.algorand.org/docs/reference/transactions/#payment-transaction
    // receiver account to send to
    const receiver = Prince.addr;
    const enc = new TextEncoder();
    const amount = 0;
    const sender = Prince.addr;
    // closeToRemainder will remove the assetholding from the account
    const closeRemainderTo = DISPENSERACCOUNT;
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender, 
        to: receiver,
        amount, 
        closeRemainderTo, 
        note: undefined, 
        suggestedParams: params});
    // Sign the transaction
    const rawSignedTxn = txn.signTxn(Prince.sk);
    // Submit the transaction
    const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
    // Wait for confirmation
    const confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    // const mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
    // console.log("Transaction information: %o", mytxinfo);
    accountInfo = await algodClient.accountInformation(Prince.addr).do();
    let txAmount = confirmedTxn.txn.txn.amt;
    if (confirmedTxn.txn.txn.amt == undefined) {
        console.log("Transaction Amount: %d microAlgos", 0);
        txAmount=0;
    }
    else {
        console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);

    }
    console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
    const closeoutamt = startingAmount - txAmount - confirmedTxn.txn.txn.fee;
    console.log("Close To Amount: %d microAlgos", closeoutamt);
    console.log("Bobs Account balance: %d microAlgos", accountInfo.amount);
    return;
    // Sample Output
    // ==> CLOSE OUT Prince'S ALGOS TO DISPENSER
    // Prince Account balance: 8996000 microAlgos
    // Transaction IC6IQVUOFLTTXNWZWD4F6L5CZXOFBTD3EY2QJUY5MHUOQSAX3CEA confirmed in round 16833543
    // Transaction Amount: 0 microAlgos
    // Transaction Fee: 1000 microAlgos
    // Bobs Account balance: 0 microAlgos
}

const createAccount = function () {
    try {
        // let account1_mnemonic = "goat march toilet hope fan federal around nut drip island tooth mango table deal diesel reform lecture warrior tent volcano able wheel marriage absorb minimum";
        // const myaccount = algosdk.mnemonicToSecretKey(account1_mnemonic);
        const myaccount = algosdk.generateAccount();
        console.log("Account Address = " + myaccount.addr);    
        return myaccount;
    }
    catch (err) {
        console.log("err", err);
    }
};


/**
 * Wait until the transaction is confirmed or rejected, or until 'timeout'
 * number of rounds have passed.
 * @param {algosdk.Algodv2} algodClient the Algod V2 client
 * @param {string} txId the transaction ID to wait for
 * @param {number} timeout maximum number of rounds to wait
 * @return {Promise<*>} pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next timeout rounds
 */
const waitForConfirmation = async function (algodClient, txId, timeout) {
    if (algodClient == null || txId == null || timeout < 0) {
        throw new Error("Bad arguments");
    }

    const status = (await algodClient.status().do());
    if (status === undefined) {
        throw new Error("Unable to get node status");
    }

    const startround = status["last-round"] + 1;
    let currentround = startround;

    while (currentround < (startround + timeout)) {
        const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
        if (pendingInfo !== undefined) {
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                return pendingInfo;
            } else {
                if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                    // If there was a pool error, then the transaction has been rejected!
                    throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
                }
            }
        }
        await algodClient.statusAfterBlock(currentround).do();
        currentround++;
    }
    throw new Error("Transaction " + txId + " not confirmed after " + timeout + " rounds!");
};
// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodClient, account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    let accountInfo = await algodClient.accountInformation(account).do();
    for (idx = 0; idx < accountInfo['created-assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['created-assets'][idx];
        if (scrutinizedAsset['index'] == assetid) {
            console.log("AssetID = " + scrutinizedAsset['index']);
            let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
            console.log("parms = " + myparms);
            break;
        }
    }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodClient, account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    let accountInfo = await algodClient.accountInformation(account).do();
    for (idx = 0; idx < accountInfo['assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['assets'][idx];
        if (scrutinizedAsset['asset-id'] == assetid) {
            let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.log("assetholdinginfo = " + myassetholding);
            break;
        }
    }
};


async function createNFT() {

    try {
        let Prince = createAccount();
        console.log("Press any key when the account is funded");
        await keypress();
        // Connect your client
        // const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        // const algodServer = 'http://localhost';
        // const algodPort = 4001;
        const algodToken = '2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b';
        const algodServer = 'https://academy-algod.dev.aws.algodev.network';
        const algodPort = 443;

        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        // CREATE ASSET
        const { assetID } = await createAsset(algodClient, Prince);
        // DESTROY ASSET
        await destroyAsset(algodClient, Prince, assetID); 
            // CLOSEOUT ALGOS - Prince closes out Alogs to dispenser
        await closeoutPrinceAlgos(algodClient, Prince);
        

    }
    catch (err) {
        console.log("err", err);
    }
      process.exit();
};



createNFT();
