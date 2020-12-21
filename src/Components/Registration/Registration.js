import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import renderMessage from '../../message';
 
class Registration extends React.Component {

    constructor() {
        super();
        this.state = {
            login: '',
            email: '',
            password: '',
            repeat_password: '',
            message: {
                body: '',
                type: ''
            },
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
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
    InputLabel = styled.h3`
    font-size: 18px;
    margin: 0px;
    `;
    RegistrationLink = styled.a`
    font-size: 15px;
    text-decoration: none;
    color: blue;
    `;

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    isInputValid = () => {
        debugger
        if (this.state.login.length < 8 || this.state.login.length > 16) {
            this.setState({
                message: {
                    body: 'Your login must be 8-16 symbols long',
                    type: 'error'
                }
            }
            ); return false
        }

        if (this.state.login.includes('@')) {
            this.setState({
                message:
                {
                    body: 'No (@) symbol allowed in login',
                    type: 'error'
                }
            }
            ); return false
        }

        let emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(this.state.email)) {
            this.setState(prevState => {
                return {
                    message: {
                        body: 'This email is not valid',
                        type: 'error'
                    }
                }
            }); return false
        }

        if (this.state.password.length < 8 || this.state.password.length > 16) {
            this.setState({
                message:{
                    body: 'Your password must be at least 8-16 symbols long',
                    type: 'error'
                } 
            }
            ); return false
        }

        if (this.state.repeat_password !== this.state.password) {
            this.setState({
                message: {
                    body: 'Your repeat password must match your password',
                    type: 'error'
                }
            }); return false
        }
        return true;
    }

    sendRequest = () => { 
        if (!this.isInputValid()) {
            return;
        }
        const body = {
            Login: this.state.login,
            Email: this.state.email,
            Password: this.state.password,
        };
        axiosSetUp().post('http://localhost:5002/user/register', body)
            .then(response => {
                if (response.status === 201)
                    this.props.history.push('/authentication');
                else
                    throw response
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: error.data || [],
                        type: 'error'
                    }
                })
                console.log(error);
            })

    };

    renderMessage = () => {
        switch (this.state.message.type) {
            case 'error':
                return <Typography variant="subtitle1" style={{ color: "red" }}>{this.state.message.body}</Typography>
            case 'info':
                return <Typography variant="subtitle1">{this.state.message.body}</Typography>
        }
    }


    render() {
        return (
            <this.Wraper>
                <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Registration</Typography >
                <ExpansionPanel>
                    <form>
                        <this.Input name="login" type="text" onChange={this.handleChange} />  <Typography variant='subtitle1'>Login </Typography><br />
                        <this.Input name="email" type="text" onChange={this.handleChange} /> <Typography variant='subtitle1'>Email </Typography><br />
                        <this.Input name="password" type="password" onChange={this.handleChange} />  <Typography variant='subtitle1'>Password </Typography><br />
                        <this.Input name="repeat_password" type="password" onChange={this.handleChange} />  <Typography variant='subtitle1'>Repeat password </Typography><br />
                    </form>
                </ExpansionPanel>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Button variant="contained" color="primary" onClick={this.sendRequest}>Submit</Button>
                <this.RegistrationLink href="/authentication">Already have an account?</this.RegistrationLink>
            </this.Wraper>
        );
    }
}

export default Registration
