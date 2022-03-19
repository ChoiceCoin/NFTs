const Host = "https://testnet-algorand.api.purestake.io/ps2";
const Puretoken = {
    "X-API-Key": "z6H94GE3sI8w100S7MyY92YMK5WIPAmD6YksRDsC"
}
const Port = "";
const algodClient = new algosdk.Algodv2(Puretoken, Host, Port);

const redAddress = "JJT4MJLJPNEWPO3B4DDTXP34B2DOVLIRY5O456M4T2I2RZUVWOC2ZCUSMQ"

const defaultFrozen = false;
const unitName = "NFT";
let assetName;
const url = "https://gateway.pinata.cloud/ipfs/QmbFDKotJSDVzHNgvDVceHwp4BJ4zMBrqLxta64CgcYEA9?preview=1";
const managerAddr =
  "CP3S2LOQCQZWVZIAOIVBEDLLHU4YXWIIYW5LQ35PJHJEHJTDCHJC2LC56E";
const reserveAddr = undefined;
const freezeAddr = undefined;
const clawbackAddr = undefined;
const metadata = undefined;
const total = 1; // NFTs have totalIssuance of exactly 1
const decimals = 0; // NFTs have decimals of exactly 0

//error modal 
const err = document.getElementById('error');

//success modal
const success = document.getElementById('success');

//getting nft image title from id
const nft_title = document.getElementById("nftTitle");

//getting nft image upload from id 

const nftImage = document.getElementById('file-ip-1');




const ASSET_ID = 21364625; // choicr asset ID

var dropdownModal = document.getElementById('simpleModal'); //wallet dropdown modal


let respons; //respons
const myAlgoConnect = new MyAlgoConnect(); //initialize


/// connection to my algo wallet

const myAlgoWalletConnect = async () => {

    try {
        let response = await myAlgoConnect.connect();
        dropdownModal.style.display = 'none';
        console.log(response);
        if(response) {
             dropdownModal.style.display = 'none';
             success.textContent = "My AlgoWallet successfully connected";
             success.classList.add("success_show");
             setTimeout(() => {
                 success.classList.remove("success_show");
             }, 1000)


             respons = response[0].address

        
            }
        }
    catch (error){
        dropdownModal.style.display = 'none';
        err.textContent= "Error Connecting to My AlgoWallet 📃 "
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 2000)
        console.log(error);
    }

}

const sendChoiceBeforeNFT = async () => {
    if(!respons) {
        err.textContent= "You need to connect your wallet to create NFT 📵"
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 1000)
       } else {

        // send 10 choice first

  let param = await algodClient.getTransactionParams().do(); //get params
  let encode = new TextEncoder();  //encode
              try {
                  let txn = await algosdk.makeAssetTransferTxnWithSuggestedParams(
                      respons,
                      redAddress,
                      undefined,
                      undefined,
                      1,
                      encode.encode("Sending choice before generating nft"),
                      ASSET_ID,
                      param
                  );
                  const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
                  const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
                    
                  if(response) {
                    success.textContent = "You can now generate NFT";
                    success.classList.add("success_show");
                    setTimeout(() => {
                        success.classList.remove("success_show");
                    }, 1000)
                  }
            

       }
       catch(error){
        err.textContent= "Error Sending $choice before generating NFT "
        err.classList.add("error_show")
        setTimeout(() => {
            err.classList.remove("error_show")
        }, 2000)
        console.log(error);
    }
}
}

const createNFT = async () => {

    if(!respons) {
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
                from: respons,
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
                const signedTxn = await myAlgoConnect.signTransaction(txn.toByte())
                const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
                console.log(response);

                if(response) {
                    success.textContent = `NFT TxID - ${response.txId}`;
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

const checkWalletToTransferChoice =  () => {
    if(respons) {
        sendChoiceBeforeNFT()
    } else {
        sendCoinBeforeNFT()
    }
}

const checkWalletToGenerateNFT = () => {
    if(respons) {
        createNFT()
    } else {
        generateNFT()
    }
}