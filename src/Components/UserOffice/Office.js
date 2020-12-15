import React from 'react'
import styled from 'styled-components';
import Info from './OptionsBar/Info';
import UserStories from './OptionsBar/UserStrories';
import Settings from './OptionsBar/Settings';


class Office extends React.Component {

  constructor() {
    super()
    this.state = {
      activeComponent: <Info/>
    }
  }

  button(text, Component) {
    return (
      <this.ListButton onClick={() => this.setState({ activeComponent: Component })}>
        {text}
      </this.ListButton>
    )
  }

  ListButton = styled.a`
    text-decoration: none;
    display: block;
    color: white;
    text-align: center;
    padding: 10px 10px;
    `;
  ListElement = styled.li`
    & a {
      &:hover {
          background-color: #888;
        }
    }
    display:inline;
    float: left;
    margin: 0;
    padding: 0;
  `;
  List = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0px;
    overflow: hidden;
    background-color: #777;
  `;


  render() {
    return (
      <>
        <this.List>
          <this.ListElement>
            {this.button('Info', <Info />)}
          </this.ListElement>
          <this.ListElement>
            {this.button('Your stories', <UserStories />)}
          </this.ListElement>
          <this.ListElement>
            {this.button('Settings', <Settings />)}
          </this.ListElement>
        </this.List>

        { this.state.activeComponent}
      </>
    )
  }
}

export default Office;