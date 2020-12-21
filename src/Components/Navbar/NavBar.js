import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';

class NavBar extends React.Component {

  NavBarListElement = styled.li`
  background-color: #3f51b5;
  & a {
    &:hover {
        background-color: lightblue;
      }
  }
  display:inline;
  float: right;
  border-style: solid;
  border-width: 1px;
  margin: -5px;
  `;
  NavBarList = styled.ul`
  list-style-type: none;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  background-color: #3f51b5;
  border-style: solid;
  border-width: 0px;
  border-bottom-width: 3px;
  `;

  _service;

  render() {
    return (
      <this.NavBarList>
        <this.NavBarListElement style={{float: "left"}}>
          <NavBarButton linkInfo={{
            link: "/",
            text: "LongStory"
          }} />
        </this.NavBarListElement>

        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "Registration",
            text: "Register"
          }} />
        </this.NavBarListElement>

        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "Authentication",
            text: "Login"
          }} />
        </this.NavBarListElement>
      </this.NavBarList>
    )
  }
}

export default NavBar;