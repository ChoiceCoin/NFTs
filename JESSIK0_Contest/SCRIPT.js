let note = undefined; // arbitrary data to be stored in the transaction; here, none is stored
// Asset creation specific parameters
// The following parameters are asset specific
// Throughout the example these will be re-used. 
// We will also change the manager later in the example
let addr = recoveredAccount1.addr;
// Whether user accounts will need to be unfrozen before transacting    
let defaultFrozen = false;
// integer number of decimals for asset unit calculation
let decimals = 0;
// total number of this asset available for circulation   
let totalIssuance = 1;
// Used to display asset units to user    
let unitName = "CHC";
// Friendly name of the asset    
let assetName = "CHOICE COIN1";
// Optional string pointing to a URL relating to the asset
let assetURL = "https://tinyurl.com/jessiko1";
// Optional hash commitment of some sort relating to the asset. 96 character length.
let assetMetadataHash = "NmQ2YTY1MDEyYmZmMTM5M2EzZDI5ZDhjZjgwMTU3MGI=";
// The following parameters are the only ones
// that can be changed, and they have to be changed
// by the current manager
// Specified address can change reserve, freeze, clawback, and manager
let manager = recoveredAccount2.addr;
// Specified address is considered the asset reserve
// (it has no special privileges, this is only informational)
let reserve = recoveredAccount2.addr;
// Specified address can freeze or unfreeze user asset holdings 
let freeze = recoveredAccount2.addr;
// Specified address can revoke user asset holdings and send 
// them to other addresses    
let clawback = recoveredAccount2.addr;

// signing and sending "txn" allows "addr" to create an asset
let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(addr, note,
        totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
    clawback, unitName, assetName, assetURL, assetMetadataHash, params);

let rawSignedTxn = txn.signTxn(recoveredAccount1.sk)
let tx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
console.log("Transaction : " + tx.txId);
let assetID = null;
// wait for transaction to be confirmed
await waitForConfirmation(algodclient, tx.txId);
// Get the new asset's information from the creator account
let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
assetID = ptx["asset-index"];