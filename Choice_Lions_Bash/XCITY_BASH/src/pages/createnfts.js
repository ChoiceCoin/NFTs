import React from "react";
import VoteNav from "../components/VotingNavBar";
import CreateVote from "../components/Voting";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const CreateNFTs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <VoteNav toggle={toggle} />
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <CreateVote />
    </>
  );
};

export default CreateNFTs;
