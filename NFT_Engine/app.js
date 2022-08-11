// Imports
import './App.css';
import { useEffect, useState } from 'react';


// Wallet Connect
// const isPhantomInstalled = window.phantom?.solana?.isPhantom
const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  window.open('https://phantom.app/', '_blank');
};


// React functions must return a React component
function App() {
  // Set State
  const [currentFile,setCurrentFile] = useState(null)

  // Wallet Connect
  const provider = getProvider();
  async function walletConnect() {
    try {
      const resp = await provider.connect();
      console.log(resp.publicKey.toString());
    } catch (err) {
      console.log(err)
    }
  }
  async function walletDisconnect(){
    try {
      const resp = await provider.disconnect();
      console.log(resp);
    } catch (err) {
    console.log(err)
    }
  }
  async function uploadFile(event){
    const [file] = event.target.files;
    setCurrentFile(file);
  }

  async function nftMint(){

  }

  useEffect(() => {
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Solana NFT Machine
        </h1>

        <hr id="hr1"/>

        <div id ="connect">
          <div>
            Wallet Connect
          </div>
          <div>
            <button id='button1' onClick={walletConnect}>Connect</button>
          </div>
          <div>
            <button id='button2' onClick={walletDisconnect}>Disconnect</button>
          </div>
        </div>

        <hr id="hr1"/>

        <div id ="properties">
          <div>
            Properties
          </div>

          <div>
            < input id='image' onChange={uploadFile} type='file'/> 
          </div>

          <div>
            Check the box to affirm acceptance.
            <input id="TC" type="radio"/>
          </div>
        </div>

        <hr id="hr1"/>

        <div id="mint">
          <div>
            Mint NFT
          </div>
          <div>
            <button id='button4' onClick={nftMint}>Mint</button>
          </div>
        </div>

        <hr id="hr1"/>
          
      </header>
    </div>
  );

}

export default App;
