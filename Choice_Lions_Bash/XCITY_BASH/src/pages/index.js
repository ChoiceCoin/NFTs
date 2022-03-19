import React, { useReducer, useState } from "react";
import { createPost } from "../actions/posts";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import {
  homeObjfour,
  homeObjone,
  homeObjthree,
  homeObjtwo,
} from "../components/InfoSection/Data";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((post) => post._id !== action.payload);
    default:
      return state;
  }
};

const Home = () => {
  const initialState = "";
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mo, setmo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <HeroSection />
      <InfoSection {...homeObjone} />
      <InfoSection {...homeObjtwo} />
      <InfoSection {...homeObjthree} />
      <InfoSection {...homeObjfour} />
      <Footer />
    </>
  );
};

export default Home;
