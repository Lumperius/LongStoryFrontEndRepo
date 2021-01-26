import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import Logout from '../Logout/Logout';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import setAvatar from '../../Actions/setAvatar';
import { withTheme } from '@material-ui/core/styles';
import history from '../../history.js'
import logo from './Logo.png'
import ChatIcon from '@material-ui/icons/Chat';
import Tooltip from '@material-ui/core/Tooltip';
import setDialog from '../../Actions/setDialog';

class AuthorizedNavBar extends React.Component {

  constructor() {
    super();
    this.state = {
      avatar: ''

    }
  }
  NavBarListElement = styled.li`
  & a {
    &:hover {
        background-color: lightblue;
      }
  }
  font-size: 17px;
  display:inline;
  float: left;
  border-right-style: solid;
  border-right-width: 1px;
  margin-bottom: -5px;
  overflow: hidden;
  `;
  LogoutElement = styled.li`
  & div {
    &:hover {
        background-color: lightblue;
        cursor: pointer;
      }
  }
  padding: 1px;
  font-size: 17px;
  display: inline;
  float: right;
  font-weight:600;
  margin-bottom: -6px;
  margin-left: -11px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  `;
  CurrentUser = styled.li`
  display:inline;
  float: right;
  display: inline;
  text-align: center;
  padding-top: 12px;
  padding-right: 10px;
  font-size: 20px;
  color: white;
  overflow: hidden;
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
  NavBarLogo = styled.img`
  height: 38px;
  margin: 10px;
  display: block;
  &:hover {
    cursor: pointer;
  }
  `;

  componentDidMount() {
    if (!this.props.token)
    this.props.history.push('authentication');

    if(!this.props.avatar)
    this.sendGetAvatarRequest();
  }

  handleLogoClick = () => {
    history.push('/');
  }

  handleIconClick = () => {
    if(this.props.dialog.UnreadMessages.some(x=> x));
    let dialog = {
      targetUser: this.props.dialog.UnreadMessages[0],
      open: true
    }
    this.props.setDialog(dialog)
  }

  sendGetAvatarRequest = () => {
    let userId = this.props.token.id;
    axiosSetUp().get(`http://localhost:5002/userInfo/getAvatar?userId=${userId}`)
      .then(response => {
        this.props.setAvatar(response.data)
      })
      .catch(error => {
        console.log(error.data)
      })
  }

  adminElement = () => {
    if (this.props.token.scope === 'Admin') {
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

  renderUnreadNotification = () => {
       if(this.props.dialog.UnreadMessages.some(x => x))
       return <Tooltip title={
       <div style={{fontSize: "14px", fontWeight: "300"}}>
       You have {this.props.dialog.UnreadMessages.length} unread message(s).<br />
       Click to see next.
       </div>}>
       <ChatIcon 
       style={{color: "orange", float: "right", margin: "9px", marginRight: "20px"}}
       fontSize="large"
       onClick={this.handleIconClick}
       />
       </Tooltip>
  }

  render() {
    return (
      <nav>
        <this.NavBarList style={{ backgroundColor: this.props.theme.palette.primary.dark }}>
          <this.NavBarListElement style={{ fontWeight: "600" }}>
            <this.NavBarLogo
             src={logo}
             width="auto"
             onClick={this.handleLogoClick}/>
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "Office",
              text: "Your office"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "IntializeStory",
              text: "Start a story"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "/Books",
              text: "Books"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement>
            <NavBarButton linkInfo={{
              link: "/chat",
              text: "Chat room"
            }} />
          </this.NavBarListElement>

          {this.adminElement()}

          <this.LogoutElement>
            <Logout />
          </this.LogoutElement>

          <this.Avatar src={`data:image/jpeg;base64,${this.props.avatar}`} width="50px" />
          <this.CurrentUser> Welcome {this.props.token.login}! </this.CurrentUser>
          
          {this.renderUnreadNotification()}
        </this.NavBarList>
      </nav>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAvatar: avatar => dispatch(setAvatar(avatar)),
    setDialog: dialog => dispatch(setDialog(dialog))
  };
};

const mapStateToProps = state => {
  return {
    dialog: state.dialog,
    avatar: state.avatar.avatar || null,
    token: state.token.tokenObj
  }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(AuthorizedNavBar))