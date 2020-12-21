import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import jwt_decode from 'jwt-decode';
import setToken from '../../Actions/setToken';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import setAvatar from '../../Actions/setAvatar';
import renderMessage from '../../message';

class Authentication extends React.Component {

    constructor() {
        super()
        this.state = {
            loginOrEmail: '',
            password: '',
            message: {
                body: '',
                type: ''
            },
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 10px;
    border-color: dark;
    background-color: white:
    `;
    Input = styled.input`
    margin:10px;
    margin-up: 0px;
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
    RegistrationLink = styled.a`
    font-size: 15px;
    text-decoration: none;
    color: blue;
    `;
    ErrorMessage = styled.p` 
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
        if (emailRegex.test(this.state.loginOrEmail)) return 'Email';
                                                 else return 'Login';
    }

    validateAuthRequest = (body) => {
            if(body.loginOrEmail.toString().length < 1 || body.loginOrEmail.toString().length > 30){
                this.setState({
                    message:{
                        body: 'Invalid login or email',
                        type: 'error'
                    }
                })
                return false;
            }
            if(body.password.toString().length < 1 || body.password.toString().length > 30){
                this.setState({
                    message:{
                        body: 'Invalid password',
                        type: 'error'
                    }
                })
                return false;
            }
            return true;
    }


    sendAuthenticationRequest = () => {
        let inputType = this.getLoginOrEmailType()
        const body = {
            loginOrEmail: this.state.loginOrEmail,
            password: this.state.password,
            inputType: inputType
        };
        if(!this.validateAuthRequest(body)) {return;}
        axiosSetUp().post('http://localhost:5002/user/authenticate', body)
            .then(response => {
                let tokenData = jwt_decode(response.data);
                localStorage.setItem('Token', response.data);
                this.props.setToken(tokenData);
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error.json);
                this.setState({
                    message: {
                        body: error.data,
                        type: 'error'
                    }
                })
        })
};


render() {
    return (
        <this.Wraper>
            <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Login</Typography >

            <ExpansionPanel>
                <form>
                    <this.Input name="loginOrEmail" type="text" onChange={this.handleChange} /> <Typography variant='subtitle1'>Login or email </Typography><br />
                    <this.Input name="password" type="password" onChange={this.handleChange} /> <Typography variant='subtitle1'>Password </Typography><br />
                </form>
            </ExpansionPanel>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button variant="contained" color="primary" onClick={this.sendAuthenticationRequest}>Submit</Button>
            <this.RegistrationLink href="/registration">Not registred?</this.RegistrationLink>
        </this.Wraper>
    );
}
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setToken: token => dispatch(setToken(token)),
        setAvatar: avatar => dispatch(setAvatar(avatar))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication)