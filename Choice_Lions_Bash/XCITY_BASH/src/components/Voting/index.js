import React, { useEffect, useRef, useState } from "react";
import algosdk from "algosdk";
import { VoteArea, Card, CardDiv, Ma, Button, Input } from "./VotingElements";

const CreateVote = () => {
  const [isloading, setIsloading] = useState(false);
  const [btn, setBtn] = useState(true);
  const [unitName, setUnitName] = useState("");
  const [assetName, setAssetName] = useState("");
  // const ref = useRef(initialValue)
  const defaultFrozen = false;
  const url1 =
    "https://gateway.pinata.cloud/ipfs/QmY7k3vWhvLvzbiHurmmcM5gGb7SANxMfGzwLKGhJ9iQUo/4.png";
  const url =
    "https://gateway.pinata.cloud/ipfs/QmTWkR64i5WXRUtd76cMGi79GXcNyyCBKrMHHTSZbVKEGi?preview=1";
  const managerAddr =
    "CP3S2LOQCQZWVZIAOIVBEDLLHU4YXWIIYW5LQ35PJHJEHJTDCHJC2LC56E";
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
  const metadata = undefined;
  const total = 1; // NFTs have totalIssuance of exactly 1
  const decimals = 0; // NFTs have decimals of exactly 0
  const algosdk = require("algosdk");
  const baseServer = "https://testnet-algorand.api.purestake.io/ps2";
  const port = "";

  const token = {
    "X-API-key": "YpG0KO7uiT6GkDZF2u4ng1poAqgQG3Zs3Wkv2f5L",
  };
  let algodClient = new algosdk.Algodv2(token, baseServer, port);

  const receiver = "V6E5MAP2IUZAFP676CAYFDXNFBOHIVNG3BM2TDPMTC7M7O4IVPCJRKW7FM";
  const enc = new TextEncoder();
  let ser = "CP3S2LOQCQZWVZIAOIVBEDLLHU4YXWIIYW5LQ35PJHJEHJTDCHJC2LC56E";

  const { AlgoSigner } = window;

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
  const connect = async () => {
    if (!AlgoSigner) {
      return alert("Kindly install AlgoSigner");
    }
    await AlgoSigner.connect()
      .then((d) => {
        document.getElementById("connectWallet").innerHTML = "Connected";
        console.log("CONNect");
      })
      .then(() =>
        AlgoSigner.accounts({
          ledger: "TestNet",
        })
      )
      .then((accountData) => {
        console.log(accountData);
        // for (let i = 0; i < accountData.length; i++) {
        //   document.getElementById("conn").innerHTML += accountData[i].address;
        //   console.log(accountData[i].address);
        document.getElementById("conn").innerHTML +=
          "Successfully connected to \n" + accountData[0].address;
        // }
      })
      .catch((e) => console.log("error in connection" + e));
  };
  const createNFT = async () => {
    try {
      let creator = createAccount();

      let algodClient = new algosdk.Algodv2(token, baseServer, port);
      const accountInfo = await algodClient
        .accountInformation(creator.addr)
        .do();

      const startingAmount = accountInfo.amount;

      setTimeout(() => {
        createAsset(algodClient, creator);
      }, 50000);
    } catch (err) {
      console.log("err", err);
    }
    process.exit();
  };

  const submit = async () => {
    setBtn(false);
    let inputValue = document.getElementById("propss").value;
    let amt = document.getElementById("amt").value;
    if (!inputValue) {
      alert("Enter a proposal!");
    } else {
      console.log(inputValue);
      let params = await algodClient.getTransactionParams().do();
      try {
        let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
          ser,
          receiver,
          undefined,
          undefined,
          1,
          enc.encode("Vote with Choice coin"),
          21364625,
          params
        );
        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        let signedTxn = await AlgoSigner.signTxn([{ txn: txn_b64 }]);

        let sendTxn = await AlgoSigner.send({
          ledger: "TestNet",
          tx: signedTxn[0].blob,
        });
        console.log(sendTxn);
        alert("Transaction successful!");
        createNFT();
        return sendTxn;
      } catch (error) {}
    }
  };

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
        "https://dispenser.testnet.aws.algodev.network/?account=" +
          myaccount.addr
      );

      return myaccount;
    } catch (err) {
      console.log("err", err);
    }
  };
  async function createAsset(algodClient, creator) {
    console.log("");
    console.log("==> CREATE ASSET");
    //Check account balance
    const accountInfo = await algodClient.accountInformation(creator.addr).do();
    const startingAmount = accountInfo.amount;

    // Construct the transaction
    const params = await algodClient.getTransactionParams().do();

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

    // await printCreatedAsset(algodClient, creator.addr, assetID);
    // await printAssetHolding(algodClient, creator.addr, assetID);

    return { assetID };
  }

  const [image, setImage] = useState("");
  const profileImg = image;

  function handler(e) {
    setUnitName(e.target.value);
  }
  function handlerSh(e) {
    setAssetName(e.target.value);
  }
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <>
      <button id="connectWallet" onClick={connect()}>
        Connect Wallet
      </button>
      <VoteArea>
        <Card>
          <CardDiv>Create Your Very Own Nft Now</CardDiv>
          <div id="slide">
            <div id="divS">
              <input
                type="file"
                name="image_upload"
                id="image_input"
                accept="image/*"
                onChange={(e) => imageHandler(e)}
              />
              <img src={profileImg} alt="" id="img" className="img" />
            </div>
            <div>
              <Input
                placeholder="Enter NFT Title"
                id="propss"
                value={assetName}
                onChange={handlerSh}
              ></Input>
              <Input
                placeholder="Enter the Asset Unit Name"
                value={unitName}
                id="uniteName"
                onChange={handler}
              ></Input>
              <Input placeholder="Enter the Choice Amount" id="amt"></Input>
            </div>
          </div>
        </Card>
      </VoteArea>
      {
        <Ma>
          {isloading ? (
            <Button onClick={submit} id="btn22" disabled={btn}>
              submit
            </Button>
          ) : (
            <Button onClick={submit} id="btn12">
              Created Nft
            </Button>
          )}
        </Ma>
      }
    </>
  );
};

export default CreateVote;
