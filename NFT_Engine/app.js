// Imports
import './App.css';
import { useEffect } from 'react';

// React functions must return a React component
function App() {
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
            <button id='button1'> Connect</button>
          </div>
          <div>
            <button id='button2'>Disconnect</button>
          </div>
        </div>

        <hr id="hr1"/>

        <div id ="properties">
          <div>
            NFT Properties
          </div>
          <div>
            <button id='button3' >Upload Image</button>
          </div>
          <div>
            Royalty Rate:
            <input id="amount" type="number"/>
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
            <button id='button4' >Mint</button>
          </div>
        </div>

        <hr id="hr1"/>
          
      </header>
    </div>
  );

}

export default App;