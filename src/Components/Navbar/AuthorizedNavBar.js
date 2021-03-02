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
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';
import setDialog from '../../Actions/setDialog';
import buildRequest from '../../helpers';
import addUncheckedOrder from '../../Actions/addUncheckedOrder';
import removeUncheckedOrder from '../../Actions/removeUncheckedOrder';
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_KEY = "pk_test_51IFyntKGKkWeV1dSDPnoKRgzIynRZqV5mubF4AQ79ZwVqQL5heQbPnLLfjRhAfkDvpi82Yrq1KKEFOIwNAB2DoB700XJa7leJW"

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
  display: inline;
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
  }`;

  stripePromise = loadStripe();
 

  componentDidMount() {
    if (!this.props.token)
      this.props.history.push('authentication');

    if (!this.props.avatar)
      this.sendGetAvatarRequest();
  }

  sendCheckNotificationRequest = (sessionId) => {
    debugger
    const body = {
        sessionId: sessionId
    }
    axiosSetUp().post(buildRequest('/order/setNotified'), body)
    .then(response => {
      console.log('Cachaka!')
    });
  }

  handleLogoClick = () => {
    history.push('/');
  }

  handleMessageIconClick = () => {
    if (this.props.dialog.UnreadMessages.some(x => x));
    const firstUnreadMessageUser = this.props.dialog.UnreadMessages[0];
    const dialog = {
      targetUser: firstUnreadMessageUser,
      open: true
    }
    this.props.setDialog(dialog)
  }

  handleOrderIconClick = async () => {
    if ( this.props.orders.some(x => x));
    const firstUncheckedOrder = this.props.orders[0];
    this.sendCheckNotificationRequest(firstUncheckedOrder);
    this.props.removeUncheckedOrder(firstUncheckedOrder);
    const stripePromise = loadStripe(STRIPE_KEY);
    const stripe = await stripePromise;
    stripe.redirectToCheckout({
        sessionId: firstUncheckedOrder,
    })
}


  handleButtonClick = (path) => {
    history.push(path)
  }

  sendGetAvatarRequest = () => {
    const queryData = {
      userId: this.props.token.id
    }
    axiosSetUp().get(buildRequest('/userInfo/getAvatar', queryData))
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
        <this.NavBarListElement
          onClick={() => this.handleButtonClick("/admin")}>
          <NavBarButton linkInfo={{
            text: "Admin Page"
          }} />
        </this.NavBarListElement>
      )
    }
  }

  renderUnreadMessageNotification = () => {
    if (this.props.dialog.UnreadMessages.some(x => x))
      return <Tooltip title={
        <div style={{ fontSize: "14px", fontWeight: "300" }}>
          You have {this.props.dialog.UnreadMessages.length} unread message(s).<br />
       Click to see next.
       </div>}>
        <ChatIcon
          style={{ color: "orange", float: "right", margin: "9px", marginRight: "20px" }}
          fontSize="large"
          onClick={this.handleMessageIconClick}
        />
      </Tooltip>
  }

  renderUncheckedOrderNotification = () => {
    if (this.props.orders.some(x => x))
      return <Tooltip title={
        <div style={{ fontSize: "14px", fontWeight: "300" }}>
          You have {this.props.orders.length} new orders awaiting payment.<br />
       Click to see next or manage them in your office.
       </div>}>
        <ShoppingCartIcon
          style={{ color: "lime", float: "right", margin: "9px", marginRight: "20px" }}
          fontSize="large"
          onClick={this.handleOrderIconClick}
        />
      </Tooltip>
  }


  render() {
    return (
      <nav>
        <this.NavBarList style={{ backgroundColor: this.props.theme.palette.primary.main }}>
          <this.NavBarListElement style={{ fontWeight: "600" }}>
            <this.NavBarLogo
              src={logo}
              width="auto"
              onClick={this.handleLogoClick}
            />
          </this.NavBarListElement>

          <this.NavBarListElement
            onClick={() => this.handleButtonClick("/office")}>
            <NavBarButton linkInfo={{
              text: "Your office",
            }}
            />
          </this.NavBarListElement>

          <this.NavBarListElement
            onClick={() => this.handleButtonClick("/initStory")}>
            <NavBarButton linkInfo={{
              text: "Start a story"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement
            onClick={() => this.handleButtonClick("/books")}>
            <NavBarButton linkInfo={{
              text: "Books"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement
            onClick={() => this.handleButtonClick("/books/redactor")}>
            <NavBarButton linkInfo={{
              text: "Redactor"
            }} />
          </this.NavBarListElement>

          <this.NavBarListElement
            onClick={() => this.handleButtonClick("/chat")}>
            <NavBarButton linkInfo={{
              text: "Chat room"
            }} />
          </this.NavBarListElement>

          {this.adminElement()}

          <this.LogoutElement>
            <Logout />
          </this.LogoutElement>

          <this.Avatar src={`data:image/jpeg;base64,${this.props.avatar}`} width="50px" />
          <this.CurrentUser> Welcome {this.props.token.login}! </this.CurrentUser>

          {this.renderUnreadMessageNotification()}
          {this.renderUncheckedOrderNotification()}
        </this.NavBarList>
      </nav>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAvatar: avatar => dispatch(setAvatar(avatar)),
    setDialog: dialog => dispatch(setDialog(dialog)),
    addUncheckedOrder: order => dispatch(addUncheckedOrder(order)),
    removeUncheckedOrder: order => dispatch(removeUncheckedOrder(order)),
  };
};

const mapStateToProps = state => {
  return {
    dialog: state.dialog,
    avatar: state.avatar.avatar || null,
    token: state.token.tokenObj,
    orders: state.order.UncheckedOrders || []
  }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(AuthorizedNavBar))