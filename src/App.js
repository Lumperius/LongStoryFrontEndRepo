import React from 'react';
import NavBar from './Components/Navbar/NavBar';
import AuthorizedNavBar from './Components/Navbar/AuthorizedNavBar';
import Authentication from './Components/Authentication/Authentication';
import Registration from './Components/Registration/Registration';
import Welcome from './Components/Welcome/Welcome';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom' ;
import Admin from './Components/Admin/Admin';
import Office from './Components/UserOffice/Office';
import { connect } from 'react-redux';


class App extends React.Component{
  constructor(){
  super();
  }

  render(){
    let isAuthenticated = this.props.isAuthenticated;
    let NavBarOption;

    if(isAuthenticated){NavBarOption = <AuthorizedNavBar />;}
    else {NavBarOption = <NavBar />}
     return (
     <div className="App">
       {NavBarOption}
        <Router>
          <Route exact path="/"  component={Welcome} />
          <Route exact path="/authentication" component={Authentication} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/office" component={Office} />
        </Router>
     </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
      isAuthenticated: state.isAuthenticated,
  };
}

export default connect(mapStateToProps)(App)
