import algosdk from 'algosdk';
import crypto from 'crypto';

const baseServer = "https://testnet-algorand.api.purestake.io/ps2"
const token = {
    "X-API-key": 'B3SU4KcVKi94Jap2VXkK83xx38bsv95K5UZm2lab'
};

const algod_port = '';

const algodClient = new algosdk.Algodv2(token, baseServer, algod_port);


const getInfo =  async() => {
    const accountInfo = await algodClient.accountInformation('4E5JMNWKUCV2KMCAGDUVXVWSZVH4KY5GB2BECOKGGSZDCC66LCEOJPWVCM').do();
    console.log(accountInfo);
    return accountInfo
}

const createAsset = async() => {
    try{
        const account = await getInfo() 
        let assetID = null;
        const params = await algodClient.getTransactionParams().do();
        console.log('params')
        const metaHash = crypto.createHash('md5').update('QmWXX8vjUhHD48pK9b75G6ySs8Q56bdL8pvmt4b1NtnzrE').digest('hex')
        console.log('metaHash: ', metaHash)
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: account['address'],
            total: 1,
            assetName: 'Cigar Punk',
            unitName: 'CHOICE',
            assetURL: `https://gateway.pinata.cloud/ipfs/QmWXX8vjUhHD48pK9b75G6ySs8Q56bdL8pvmt4b1NtnzrE?preview=1`,
            assetMetadataHash: metaHash,
            defaultFrozen: false,
            decimals: 0,
            freeze: account['address'],
            manager: account['address'],
            clawback: account['address'],
            reserve: account['address'],
            suggestedParams: params
        })
        // const base64Tx = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
        // const signedTxn = await AlgoSigner.signTxn([{
        //     txn: base64Tx
        // }])
        
        const sk = getSecretKey()
        console.log('Secret Key: ', sk.addr)
        const signedTxn = txn.signTxn(sk.sk)
        const tx = await algodClient.sendRawTransaction(signedTxn).do()
        console.log(tx.txId)
        const confirmedTxn = await waitForConfirmation(tx.txId, 4)
        console.log('Transaction ' + tx.txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
        const ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
        assetID = ptx['asset-index'];
        console.log(assetID)
    }
    catch (error){
        console.error(error);
    }
}

const getSecretKey = () => {
    const sk = algosdk.mnemonicToSecretKey('sport lady chef engage moral lab try smile pair moon term congress gallery furnace return chase valley shoulder romance fashion reflect lobster educate absorb phrase')
    console.log(sk)
    return sk
}

const waitForConfirmation = async(txId) => {
    while (true) {
		let lastround = await algodClient.status().lastRound;
        let pendingInfo = algodClient.pendingTransactionInformation(txId);
        console.log('LastRound: ', lastround)
        console.log('PendingInfo: ', pendingInfo)
        if (pendingInfo.round != null && pendingInfo.round > 0) {
            //Got the completed Transaction
            console.log("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
            break;
        }
        algodClient.statusAfterBlock(lastround + 1);
    }
};


export const destroyAsset = async(assetID) => {
    console.log('==> DESTROY ASSET')
    const account = await getInfo()
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        from: account['address'],
        note: undefined,
        assetIndex: assetID,
        suggestedParams: params
    })
    const sk = getSecretKey()
    const signedTxn = txn.signTxn(sk.sk)
    const tx = await algodClient.sendRawTransaction(signedTxn).do()
    const confirmedTxn = await waitForConfirmation(tx.txId, 4)
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    // The account3 and account1 should no longer contain the asset as it has been destroyed
    console.log("Asset ID: " + assetID);
}

createAsset()