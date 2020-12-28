import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

class NavBar extends React.Component {

  NavBarListElement = styled.li`
  & a {
    &:hover {
        background-color: lightblue;
      }
  }
  font-size: 17px;
  display:inline;
  float: right;
  border-right-style: solid;
  border-right-width: 1px;
  margin: -5px;
  padding: 3px;
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
      <this.NavBarList style={{backgroundColor: this.props.theme.palette.primary.main}}>
        <this.NavBarListElement style={{float: "left", fontWeight: "600"}}>
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

export default withTheme(NavBar);