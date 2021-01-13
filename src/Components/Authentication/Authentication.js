import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import jwt_decode from 'jwt-decode';
import setToken from '../../Actions/setToken';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FormikTextField } from 'formik-material-fields';
import setAvatar from '../../Actions/setAvatar';
import renderMessage from '../../message';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';


class Authentication extends React.Component {

    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
        }
    }

    LoginSchema = Yup.object().shape({
        loginOrEmail: Yup.string()
        .min(5, 'This login is too short, 5 symbols is minimum')
        .max(16, 'This login is too long, 16 symbols maximum')
        .required('Required'),
        password: Yup.string()
        .min(6, 'This login is too short, 6 symbols is minimum')
        .max(16, 'This login is too long, 16 symbols maximum')
        .required('Required'),
    });

    Wraper = styled.div`
    text-align:left;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    background-color: white;
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
    Link = styled.a`
    font-size: 15px;
    text-decoration: none;
    color: darkgrey;
    font-weight: 600;
    text-decoration: underline;
    margin: 10px;
    `;
    ErrorMessage = styled.p` 
    color: red;
    font-size: 14px;
    `;


    getLoginOrEmailType = (loginOrEmail) => {
        let emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(loginOrEmail)) return 'Email';
        else return 'Login';
    }

    validateAuthRequest = (body) => {
        if (body.loginOrEmail.toString().length < 1 || body.loginOrEmail.toString().length > 30) {
            this.setState({
                message: {
                    body: 'Invalid login or email',
                    type: 'error'
                }
            })
            return false;
        }
        if (body.password.toString().length < 1 || body.password.toString().length > 30) {
            this.setState({
                message: {
                    body: 'Invalid password',
                    type: 'error'
                }
            })
            return false;
        }
        return true;
    }


    sendAuthenticationRequest = (values) => {
        let inputType = this.getLoginOrEmailType(values.login)
        const body = {
            loginOrEmail: values.loginOrEmail,
            password: values.password,
            inputType: inputType
        };
        if (!this.validateAuthRequest(body)) { return; }
        axiosSetUp().post('http://localhost:5002/user/authenticate', body)
            .then(response => {
                let tokenData = jwt_decode(response.data);
                localStorage.setItem('Token', response.data);
                this.props.setToken(tokenData);
                this.sendGetAvatarRequest();
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


    render() {
        return (
            <this.Wraper>
                <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Login</Typography >
                <Formik
                    initialValues={{
                        loginOrEmail: '',
                        password: ''
                    }}
                    validationSchema={this.LoginSchema}
                    onSubmit= {values => {
                        delete values.repeat_password;
                        this.sendAuthenticationRequest(values)
                    }}
                >
                    {({ errors, touched }) => (
                    <Form>
                        <FormikTextField label="Login or email" name="loginOrEmail" type="text" style={{ width: "20%" }} /><br />
                        <FormikTextField label="Password" name="password" type="password" style={{ width: "20%" }} /><br />
                       
                        {renderMessage(this.state.message.body, this.state.message.type)}
                        <Button variant="contained" color="primary" type="submit">Submit</Button>
                        <this.Link href="/">or continue as guest</this.Link><br /><br />
                    </Form>
                    )}
                </Formik>
                <this.Link style={{ color: "blue" }} href="/registration">Not registered?</this.Link>
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