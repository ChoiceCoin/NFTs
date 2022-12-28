const server = "https://testnet-algorand.api.purestake.io/ps2";
const token = {
    "X-API-Key": "z6H94GE3sI8w100S7MyY92YMK5WIPAmD6YksRDsC"
}
const port = "";
const algodclient = new algosdk.Algodv2(token, server, port);

const CHOICE_ASSET_ID = 21364625;

let responses;

const algoSignerConnect = async () => {
    try {
      if (typeof window.AlgoSigner === "undefined") {
        window.open(
          "https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm",
          "_blank"
        );
      } else {
        await window.AlgoSigner.connect({
          ledger: "TestNet",
        });
        const accounts = await window.AlgoSigner.accounts({
          ledger: "TestNet",
        });
         console.log(accounts);
        if(accounts) {
            dropdownModal.style.display = 'none';
            success.textContent = "Algosigner Wallet successfully connected";
             success.classList.add("success_show");
             setTimeout(() => {
                 success.classList.remove("success_show");
             }, 1200)
             responses = accounts[0].address

        } else {
            err.textContent= "Error Connecting to Algosigner 📵 "
            err.classList.add("error_show")
            setTimeout(() => {
                err.classList.remove("error_show")
            }, 2000)
            console.log(error);
        }

      }
    } catch (error) {

        err.textContent= "Algosigner is not set up yet 📵 "
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 2000)
        console.log(error);
    
    }
  };

  const sendCoinBeforeNFT = async () => {
    if(!responses) {
        err.textContent= "You need to connect your wallet to create NFT 📵"
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 1000)
       } else {
        let params = await algodclient.getTransactionParams().do();
        let encoder = new TextEncoder();
        try {
            let txn = await algosdk.makeAssetTransferTxnWithSuggestedParams(
                responses,
                redAddress,
                undefined,
                undefined,
                1,
                encoder.encode("Vote with Choice coin"),
                ASSET_ID,
                params
             );
            // Use the AlgoSigner extension to make the transactions base64
            const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
            let signedTxn =  await AlgoSigner.signTxn([{txn: txn_b64}]);
        
            let sendTxn = await AlgoSigner.send({
                ledger: 'TestNet',
                tx: signedTxn[0].blob
            });
            if(sendTxn) {
                success.textContent = "You can now generate NFT";
                success.classList.add("success_show");
                setTimeout(() => {
                    success.classList.remove("success_show");
                }, 1000)
            }
       }
       catch(error) {
        err.textContent= "Error Sending $choice before generating NFT "
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 2000)
        console.log(error);
       }

      
  }
}

const generateNFT = async () => {
    if(!responses) {
        err.textContent= "You need to connect your wallet to create NFT 📵"
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 1000)
       }
    else if(!nft_title.value) {
        err.textContent= "Please enter nft image title ✍️"
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 1000)
    } else if(!nftImage.value)  {
        err.textContent= "Please Upload image to create NFT 🏞"
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 1000)
    } else {
                // Construct the transaction
              assetName = nft_title.value
             const params = await algodClient.getTransactionParams().do();
            
             const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: responses,
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

            const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
            let signedTxn =  await AlgoSigner.signTxn([{txn: txn_b64}]);
            let sendTxn = await AlgoSigner.send({
                ledger: 'TestNet',
                tx: signedTxn[0].blob
            });
            if(sendTxn) {
                success.textContent = `NFT TxID - ${sendTxn.txId}`;
                success.classList.add("success_show");    
            } else {
                err.textContent= "Error Generating NFT 🏞"
                err.classList.add("error_show")
                setTimeout(() => {
                    err.classList.remove("error_show")
                }, 1000) 
            }

    }
} 