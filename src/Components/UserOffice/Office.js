import React from 'react'
import styled from 'styled-components';
import Info from './OptionsBar/Info';
import UserStories from './OptionsBar/UserStrories';
import Settings from './OptionsBar/Settings';
import { connect } from 'react-redux';

class Office extends React.Component {

  constructor() {
    super()
    this.state = {
      activeComponent: <Info />
    }
  }

  componentDidMount = () => {
    if (this.props.token === undefined)
      this.props.history.push('authentication');
  }

  button(text, Component) {
    return (
      <this.ListButton onClick={() => this.setState({ activeComponent: Component })}>
        {text}
      </this.ListButton>
    )
  }
  Wraper = styled.div`
    text-align:left;
    margin: 10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: dark;
    background-color: white;
    `;

  ListButton = styled.a`
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: white;
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
  border-width: 1px;
  border-style: solid;
  border-color: white;
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
        <this.Wraper>
          {this.state.activeComponent}
        </this.Wraper>
      </>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    token: state.token.tokenObj,
  };
}

export default connect(mapStateToProps)(Office)