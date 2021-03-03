import React from 'react';
import NavBar from './Components/Navbar/NavBar';
import AuthorizedNavBar from './Components/Navbar/AuthorizedNavBar';
import Authentication from './Components/Authentication/Authentication';
import Registration from './Components/Registration/Registration';
import Welcome from './Components/IndexPage/IndexPage';
import { Router, Route } from 'react-router-dom';
import Admin from './Components/Admin/Admin';
import Office from './Components/UserOffice/Office';
import { connect } from 'react-redux';
import getParsedToken from './Services/Service';
import setToken from './Actions/TokenActions/setToken'
import Logout from './Components/Logout/Logout';
import InitializeStory from './Components/Story/InitializeStory';
import Story from './Components/Story/Story';
import history from './history.js'
import 'typeface-roboto'
import { withTheme } from '@material-ui/core/styles';
import ChatHub from './Components/ChatHub/ChatHub';
import PrivateDialog from './Components/PrivateChat/PrivateDialog';
import BookCompose from './Components/Books/StoryBook/StoryBookCompose';
import BookPage from './Components/Books/BookPage';
import StoryBook from './Components/Books/StoryBook/StoryBook';
import OrderBook from './Components/Books/OrderBook';
import SuccessOrder from './Components/Books/SuccessOrder';
import OrderWebSocketConnection from './Components/OrderWebSocketConnection/OrderWebSocketConnection';
import BookRedactor from './Components/Books/BookEditor/BookRedactor';


class App extends React.Component {

  componentDidMount() {
    let token = getParsedToken();
    if (token) {
      this.props.setToken(token);
    }
  }


  renderNavBar = () => {
    if (this.props.tokenObj) {
      return <AuthorizedNavBar />;
    }
    else { return <NavBar />; }
  }

  renderMessenger = () => {
    if (this.props.tokenObj) {
      return <PrivateDialog />;
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderNavBar()}
        <Router history={history}>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/authentication" component={Authentication} />
          <Route exact path="/books" component={BookPage} />
          <Route exact path="/books/book:bookId" component={StoryBook} />
          <Route exact path="/books/composeBook" component={BookCompose} />
          <Route exact path="/books/orderBook:bookId" component={OrderBook} />
          <Route exact path="/books/redactor" component={BookRedactor} />
          <Route exact path="/books/success" component={SuccessOrder} />
          <Route exact path="/chat" component={ChatHub} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/office" component={Office} />
          <Route exact path="/initStory" component={InitializeStory} />
          <Route exact path="/story:storyId" component={Story} />
        </Router>
        {this.renderMessenger()}
        <OrderWebSocketConnection />
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    tokenObj: state.token.tokenObj,
    dialog: state.dialog,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token))
  };
};

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(App))
