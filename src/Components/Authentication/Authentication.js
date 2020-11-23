import React  from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import jwt_decode from 'jwt-decode';
import setToken from '../../Actions/setToken'


class Authentication extends React.Component{

    constructor(){
        super()
        this.state = {   
          loginOrEmail: '',
          password: '',
          message: ''
      }
    }

    Wraper = styled.div`
    text-align:left;
    margin:90px;
    font-size: 28px;
    `;
    Input = styled.input`
    upper-margin: 0px;
    border: 1px solid black;
    width: 30%;
    height: 30px;
    `;
    SubmitButton = styled.button`
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    `;
    InputLabel = styled.h3`
    font-size: 18px;
    margin: 0px;
    `;
    RegistrationLink = styled.a`
    font-size: 15px;
    text-decoration: none;
    color: blue;
    `;
    ErrorMessage= styled.p` 
    color: red;
    font-size: 14px;
    `;

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getLoginOrEmailType = () => {
        let emailRegex = /\S+@\S+\.\S+/;
        if(emailRegex.test( this.state.loginOrEmail)) return 'Email';
        else return 'Login';
    }

    sendRequest = () => {
        let inputType = this.getLoginOrEmailType()
        const body = { 
            loginOrEmail: this.state.loginOrEmail,
            password: this.state.password,  
            inputType: inputType
     };
     axiosSetUp().post('http://localhost:5002/api/authenticate', body)
        .then(response => {
            let tokenData = jwt_decode(response.data);
            this.props.setToken(tokenData);
            localStorage.setItem('Token', response.data);
            this.props.history.push('/');
        })
        .catch(error => {
            console.log(error.json);
            this.setState({message: error.data});
        })
    };

    render() {
        return(
            <this.Wraper>
                <h2>Login</h2>
                <this.ErrorMessage>{this.state.message}</this.ErrorMessage>
                <form>
                     <this.Input name="loginOrEmail" type="text" onChange={this.handleChange}/> <this.InputLabel>Login or email </this.InputLabel><br/>                   
                     <this.Input name="password" type="password" onChange={this.handleChange}/> <this.InputLabel>Password </this.InputLabel><br/><hr/><br/>                       
                     <this.SubmitButton type="button" onClick={this.sendRequest}>Submit</this.SubmitButton>
                </form>
                 <this.RegistrationLink href="/registration">Not registred?</this.RegistrationLink>
            </this.Wraper>
        );
    }
}

const mapStateToProps = function (state) {
    return {
       // auth: state.auth.isAuthenticated,
       // role: state.auth.role,
       token: state.token.tokenObj
    };
}

const mapDispatchToProps = dispatch => {
    return {
        //changeAuthenticate: isAuthenticated => dispatch(login(isAuthenticated)),
        setToken: token => dispatch(setToken(token))
    };
};
  
  export default connect(mapStateToProps, mapDispatchToProps)(Authentication)