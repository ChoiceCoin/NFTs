import React from "react";
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./VotingElements";
import { FaBars } from "react-icons/fa";

const VoteNav = ({ toggle }) => {
  return (
    <>
      <Nav>
        <NavbarContainer>
          <NavLogo to="/">Choice Coin</NavLogo>
          <MobileIcon onClick={toggle}>
            <FaBars />
          </MobileIcon>
          <NavMenu>
            <NavItem>
              <NavLinks to="about">Create NFTs</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="discover">Collections</NavLinks>
            </NavItem>
          </NavMenu>
          <NavBtn>
            <NavBtnLink
              href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=297995609"
              target="_blank"
              rel="noopener"
              primary
            >
              Connect Wallet
            </NavBtnLink>
          </NavBtn>
        </NavbarContainer>
      </Nav>
    </>
  );
};

export default VoteNav;
