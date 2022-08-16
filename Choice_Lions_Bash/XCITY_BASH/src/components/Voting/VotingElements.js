import styled from "styled-components";
import { Link } from "react-router-dom";

export const VoteArea = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Card = styled.div`
  width: 60%;
  height: 70%;
  border-width: 2px;
  border-color: red;
  background: grey;
`;
export const CardDiv = styled.div`
  width: auto;
  height: 50px;
  color: white;
  text-align: center;
  font-size: 1.4rem;
  padding: 10px;
  background: black;
  border-radius: 10px;
  margin: 10px;
`;
export const Input = styled.input`
  width: 70%;
  margin-top: 30px;
  margin-left: 16%;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
`;
export const Ma = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -50px;
`;
export const Button = styled.button`
  width: 100px;
  border-radius: 10px;
  background: ${({ primary }) => (primary ? "#01BF71" : "#378805")};
  white-space: nowrap;
  padding: 10px;
  color: ${({ dark }) => (dark ? "#010606" : "#fff")};
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    transition: all 0.2s ease-in-out;
    bacckground: ${({ primary }) => (primary ? "#fff" : "#01BF71")};
  }
`;
