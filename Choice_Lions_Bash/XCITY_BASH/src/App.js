import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Proposal from "./pages/proposal";
import Castvote from "./pages/castvote";
import CreateNFTs from "./pages/createnfts";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={Home()} />
        <Route path="/proposal" element={Proposal()} exact />
        <Route path="/castvote" element={Castvote()} exact />
        <Route path="/createnfts" element={CreateNFTs()} exact />
      </Routes>
    </Router>
  );
}

export default App;
