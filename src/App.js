import React, { Component } from 'react';
import NavBar from './Components/Navbar/NavBar';
import AuthorizedNavBar from './Components/Navbar/AuthorizedNavBar';
import Authentication from './Components/Authentication/Authentication';
import Registration from './Components/Registration/Registration';
import Welcome from './Components/StartPage/StartPage';
import { Router, Route } from 'react-router-dom';
import Admin from './Components/Admin/Admin';
import Office from './Components/UserOffice/Office';
import { connect } from 'react-redux';
import getParsedToken from './Services/Service';
import setToken from './Actions/setToken'
import Logout from './Components/Logout/Logout';
import InitializeStory from './Components/Story/InitializeStory';
import Story from './Components/Story/Story';
import history from './history.js'
import 'typeface-roboto'



class App extends React.Component {


  componentDidMount() {
    let token = getParsedToken();
    let isAuth = undefined;
    if (token !== null) {
      let currentTime = Date.now() / 1000;
      if (token.exp > currentTime) {
        isAuth = true;
      }
    }
    this.props.setToken(token);
  }

  render() {
    let isAuthenticated = false;
    if (this.props.tokenObj !== null && this.props.tokenObj !== undefined){
            isAuthenticated = true;
    }
    let NavBarOption;
    if (isAuthenticated) { NavBarOption = <AuthorizedNavBar />; }
    else { NavBarOption = <NavBar />; }
    return (
      <div className="App">
        {NavBarOption}
        <Router history={history}>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/authentication" component={Authentication} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/office" component={Office} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/intializeStory" component={InitializeStory} />
          <Route exact path="/story:id" component={Story} />
        </Router>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    tokenObj: state.token.tokenObj,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
