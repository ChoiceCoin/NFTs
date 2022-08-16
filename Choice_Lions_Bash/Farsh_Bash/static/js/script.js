function myFunction() {
  TextToCopy = connectedAddress;
  var TempText = document.createElement("input");
  TempText.value = TextToCopy;
  document.body.appendChild(TempText);
  TempText.select();
  document.body.removeChild(TempText);
  alert("Voter's wallet Address is: " + TempText.value);
}

$(function () {
  $(document).scroll(function () {
    var $nav = $(".fixed");
    $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});

const nftName = document.getElementById("nft_name");
const nftImage = document.getElementById("file-input");
const err = document.getElementById("error");
const success = document.getElementById("success");
const pinata = document.getElementById("pinata-link");
const upload = document.getElementById("upload");
const uploadbtn = document.getElementById("btn-upload");

const defaultFrozen = false;
const unitName = "NFT";
let assetName;
const url = `${asset_url}`;
const managerAddr =
  "ZU7NJ2X2XNELIGJBUW57PETCEK4HXHL2FJKOP2DRRWWBYH2B2JPI2WDA34";
const reserveAddr = undefined;
const freezeAddr = undefined;
const clawbackAddr = undefined;
const metadata = undefined;
const total = 1; // NFTs have totalIssuance of exactly 1
const decimals = 0; // NFTs have decimals of exactly 0
const address_1 = "IHFYDNOXHI5GOMVUYGWL6WBG6C3PLNWHH22GJKJMV6JKLUJX5YAD6EEHPY";
let connectedAddress;

const transferChoice = async () => {
  if (!connectedAddress) {
    err.innerHTML = "Connect Wallet !!!!";
    err.classList.remove("d-none");
    setTimeout(() => {
      err.classList.add("d-none");
    }, 1000);
  } else {
    let params = await algodClient.getTransactionParams().do();
    let encoder = new TextEncoder();
    try {
      let txn = await algosdk.makeAssetTransferTxnWithSuggestedParams(
        connectedAddress,
        address_1,
        undefined,
        undefined,
        1,
        encoder.encode("Send Choice coin"),
        ASSET_ID,
        params
      );
      // If Algosigner account is connected, Use the AlgoSigner extension to make the transactions base64
      try {
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
        let signedTxn = await AlgoSigner.signTxn([{ txn: txn_b64 }]);
        let sendTxn = await AlgoSigner.send({
          ledger: "TestNet",
          tx: signedTxn[0].blob,
        });
        if (sendTxn) {
          success.textContent = "Choice sent!, You can now generate NFT";
          success.classList.remove("d-none");
          upload.setAttribute("onclick", "generateNFT()");
          uploadbtn.disabled = false;
          uploadbtn.removeAttribute("style");
          setTimeout(() => {
            success.classList.add("d-none");
          }, 1000);
        }
      } catch {
        // else if myAlgoWallet is connected, sign the transaction using..
        const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
        let response = await algodClient
          .sendRawTransaction(signedTxn.blob)
          .do();

        if (response) {
          success.textContent = "Choice sent!, You can now generate NFT";
          success.classList.remove("d-none");
          upload.setAttribute("onclick", "generateNFT()");
          uploadbtn.disabled = false;
          uploadbtn.removeAttribute("style");
          setTimeout(() => {
            success.classList.add("d-none");
          }, 1000);
        }
      }
    } catch (error) {
      err.textContent = "Error Sending $choice before generating NFT ";
      err.classList.remove("d-none");
      setTimeout(() => {
        err.classList.add("d-none");
      }, 2000);
      console.log(error);
    }
  }
};

const generateNFT = async () => {
  if (!connectedAddress) {
    err.textContent = "Connect your wallet !!!";
    err.classList.remove("d-none");
    setTimeout(() => {
      err.classList.add("d-none");
    }, 1000);
  } else if (!nftName.value) {
    err.textContent = "Please enter the name of your NFT";
    err.classList.remove("d-none");
    setTimeout(() => {
      err.classList.add("d-none");
    }, 1000);
  } else if (!nftImage.value) {
    err.textContent = "Please Upload an Image";
    err.classList.remove("d-none");
    setTimeout(() => {
      err.classList.add("d-none");
    }, 1000);
  } else {
    // Construct the transaction
    assetName = nftName.value;
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: connectedAddress,
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
    // If Algosigner account is connected, Use the AlgoSigner extension to make the transactions base64
    try {
      const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
      let signedTxn = await AlgoSigner.signTxn([{ txn: txn_b64 }]);
      let sendTxn = await AlgoSigner.send({
        ledger: "TestNet",
        tx: signedTxn[0].blob,
      });
      if (sendTxn) {
        success.textContent = `On Chain NFT Generated, TxID: ${sendTxn.txId}`;
        success.classList.remove("d-none");
        pinata.textContent = `This is your generated NFT Link: ${asset_url}`;
        pinata.classList.remove("d-none");
      } else {
        err.textContent = "Error Generating NFT";
        err.classList.remove("d-none");
        setTimeout(() => {
          err.classList.add("d-none");
        }, 1000);
      }
    } catch {
      // else if myAlgoWallet is connected, sign the transaction using..
      const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
      let response = await algodClient.sendRawTransaction(signedTxn.blob).do();

      if (response) {
        success.textContent = `On Chain NFT Generated, TxID: ${response.txId}`;
        success.classList.remove("d-none");
        pinata.textContent = `This is your generated NFT Link: ${asset_url}`;
        pinata.classList.remove("d-none");
      } else {
        err.textContent = "Error Generating NFT";
        err.classList.remove("d-none");
        setTimeout(() => {
          err.classList.add("d-none");
        }, 1000);
      }
    }
  }
};
