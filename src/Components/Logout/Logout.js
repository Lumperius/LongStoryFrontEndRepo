import React  from 'react'
import styled from 'styled-components';
import login from '../../Actions/login'
import { connect } from 'react-redux';



class Logout extends React.Component{

    constructor(){
        super()
    }

    handleClick = () => {
        localStorage.removeItem('Token');
        this.props.changeAuthenticate(false);
    }

    NavBarButton = styled.div`
    text-decoration: none;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    `;

    render(){
 return(             
        <this.NavBarButton onClick={this.handleClick}>     
            Logout
       </this.NavBarButton>);}
 }

 const mapDispatchToProps = dispatch => {
    return {
        changeAuthenticate: isAuthenticated => dispatch(login(isAuthenticated))
    };
};
  
  export default connect(null, mapDispatchToProps)(Logout)