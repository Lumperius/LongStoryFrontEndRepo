import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';

class NavBar extends React.Component {

  NavBarListElement = styled.li`
      & a {
        &:hover {
            background-color: lightblue;
          }
      }
      display:inline;
      float: left;
    `;
  NavBarList = styled.ul`
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #3f51b5;
    `;

  _service;

  render() {
    return (
      <this.NavBarList>
        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "/",
            text: "LongStory"
          }} />
        </this.NavBarListElement>

        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "Authentication",
            text: "Login"
          }} />
        </this.NavBarListElement>

        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "Registration",
            text: "Register"
          }} />
        </this.NavBarListElement>
      </this.NavBarList>
    )
  }
}

export default NavBar;