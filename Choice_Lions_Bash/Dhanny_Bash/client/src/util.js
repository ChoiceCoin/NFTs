/* eslint-disable no-undef */
import algosdk from 'algosdk';
import MD5 from 'crypto-js/md5';

const baseServer = "https://testnet-algorand.api.purestake.io/ps2"
const token = {
    "X-API-key": 'B3SU4KcVKi94Jap2VXkK83xx38bsv95K5UZm2lab'
};

const algod_port = '';

const algodClient = new algosdk.Algodv2(token, baseServer, algod_port);


const CheckAlgoSigner = () => {
    if (typeof AlgoSigner !== "undefined"){
        return true
    } else {
        return false
    }
}

const getInfo =  async(account) => {
    const accountInfo = await algodClient.accountInformation(account).do();
    console.log(accountInfo);
    return accountInfo
}

export const createAsset = async(accAddr, cidHash, assetName) => {
    try{
        console.log('Account: ', accAddr)
        console.log('CidHash: ', cidHash)
        console.log('AssetName: ', assetName)
        const account = await getInfo(accAddr)
        const params = await algodClient.getTransactionParams().do();
        console.log('params')
        const metaHash = MD5(cidHash)
        console.log('metaHash: ', metaHash.toString())
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: account['address'],
            total: 1,
            assetName: assetName,
            unitName: 'CHOICE',
            assetURL: `https://gateway.pinata.cloud/ipfs/${cidHash}?preview=1`,
            assetMetadataHash: metaHash.toString(),
            defaultFrozen: false,
            decimals: 0,
            freeze: account['address'],
            manager: account['address'],
            clawback: account['address'],
            reserve: account['address'],
            suggestedParams: params
        })
        const base64Tx = await AlgoSigner.encoding.msgpackToBase64(txn.toByte());
        const signedTxn = await AlgoSigner.signTxn([{
            txn: base64Tx
        }])
        const binarySignedTx = await AlgoSigner.encoding.base64ToMsgpack(signedTxn[0].blob)
        return await algodClient.sendRawTransaction(binarySignedTx).do()
    }
    catch (error){
        console.error(error);
    }
}


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

export default CheckAlgoSigner()