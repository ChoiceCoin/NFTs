import React from "react";
import VoteNav from "../components/VotingNavBar";
import CreateVote from "../components/Voting";
import { useState } from "react";

const Castvote = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <VoteNav toggle={toggle} />
      <CreateVote />
    </>
  );
};

export default Castvote;
