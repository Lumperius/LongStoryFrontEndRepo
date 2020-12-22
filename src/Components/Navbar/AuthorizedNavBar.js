import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import Logout from '../Logout/Logout';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import setAvatar from '../../Actions/setAvatar';
import axios from 'axios';

class AuthorizedNavBar extends React.Component {

  constructor() {
    super();
    this.state = {
      avatar: ''

    }
  }
  NavBarListElement = styled.li`
  background-color: #3f51b5;
  & a {
    &:hover {
        background-color: lightblue;
      }
  }
  display:inline;
  float: left;
  border-style: solid;
  border-width: 1px;
  margin: -5px;
  `;
  LogoutElement = styled.li`
  & div {
    &:hover {
        background-color: lightblue;
        cursor: pointer;
      }
  }
  display:inline;
  float: right;
  font-weight:600;
  margin: -5px;
  border-style: solid;
  border-width: 1px;
  `;
  CurrentUser = styled.li`
  display:inline;
  float: right;
  display: inline;
  text-align: center;
  padding: 16px;
  padding-top: 20px;
  font-size: 20px;
  color: white;
  margin: -10px;
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
  Avatar = styled.img`
  border-style: solid;
  border-width: 2px;
  display:inline;
  float: right;
  margin: 0px;
  margin-right: 10px;
  `;

  componentDidMount() {
    this.sendGetAvatarRequest();
  }

  static getDerivedStateFromProps(){
    return null;
  }

  sendGetAvatarRequest = () => {
    let userId = this.props.token.id;
    axiosSetUp().get(`http://localhost:5002/userInfo/getAvatar?userId=${userId}`, {
      // headers: {
      //   'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      //   'Authorization': `Bearer ${localStorage.getItem('Token')}`
      // }
    })
      .then(response => {
        this.props.setAvatar(response.data)
      })
      .catch(error => {
        console.log(error.data)
      })
  }

  adminElement = () => {
    if (this.props.token.scope === "Admin") {
      return (
        <this.NavBarListElement>
          <NavBarButton linkInfo={{
            link: "Admin",
            text: "Admin Page"
          }} />
        </this.NavBarListElement>
      )
    }
  }

  render() {
    return (
      <nav>
        <this.NavBarList>
          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "/",
              text: "LongStory"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "Office",
              text: "Your office"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "/makeBook",
              text: "Make a book"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "IntializeStory",
              text: "Start a story"
            }} />
          </this.NavBarListElement>

          {this.adminElement()}

          <this.LogoutElement>
            <Logout />
          </this.LogoutElement>

          <this.Avatar src={`data:image/jpeg;base64,${this.props.avatar}`} width="40px" height="40px" />
          <this.CurrentUser> Welcome {this.props.token.login}! </this.CurrentUser>
        </this.NavBarList>
      </nav>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAvatar: avatar => dispatch(setAvatar(avatar))
  };
};

const mapStateToProps = state => {
  return {
    avatar: state.avatar.avatar || '',
    token: state.token.tokenObj
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedNavBar)