import React  from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import setToken from '../../Actions/setToken'



class Logout extends React.Component{

    handleClick = () => {
        localStorage.removeItem('Token');
        this.props.setToken(null);
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
        setToken: token => dispatch(setToken(token))
    };
};
  
  export default connect(null, mapDispatchToProps)(Logout)