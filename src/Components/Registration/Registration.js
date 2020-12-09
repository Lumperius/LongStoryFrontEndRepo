import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

class Registration extends React.Component {

    constructor() {
        super();
        this.state = {
            login: '',
            email: '',
            password: '',
            repeat_password: '',
            message: ''
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:30px;
    padding: 50px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 20px;
    border-color: lightgrey;
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
    ErrorMessage = styled.p`
    font-size: 14px;
    color: red;
    `;

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    isInputValid = () => {
        if (this.state.login.length < 8) {
            this.setState({
                message: 'Your login must be at least 8 symbols long'
            }
            ); return false
        }

        if (this.state.login.includes('@')) {
            this.setState({
                message: 'No (@) symbol allowed in login'
            }
            ); return false
        }

        let emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(this.state.email)) {
            this.setState(prevState => {
                return { message: 'This email is not valid' }
            }); return false
        }

        if (this.state.password.length < 8) {
            this.setState({
                message: 'Your password must be at least 8 symbols long'
            }
            ); return false
        }

        if (this.state.repeat_password !== this.state.password) {
            this.setState({
                message: 'Your repeat password must match your password'
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
                    message: error.data
                })
                console.log(error);
            })

    };

    render() {
        return (
            <this.Wraper>
                <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Registration</Typography >
                <this.ErrorMessage>{this.state.message}</this.ErrorMessage>
                <ExpansionPanel>
                    <form>
                        <this.Input name="login" type="text" onChange={this.handleChange} />  <Typography variant='subtitle1'>Login </Typography><br />
                        <this.Input name="email" type="text" onChange={this.handleChange} /> <Typography variant='subtitle1'>Email </Typography><br />
                        <this.Input name="password" type="password" onChange={this.handleChange} />  <Typography variant='subtitle1'>Password </Typography><br />
                        <this.Input name="repeat_password" type="password" onChange={this.handleChange} />  <Typography variant='subtitle1'>Repeat password </Typography><br />
                    </form>
                </ExpansionPanel>
                <Button variant="contained" color="primary" onClick={this.sendRequest}>Submit</Button>
                <this.RegistrationLink href="/authentication">Already have an account?</this.RegistrationLink>
            </this.Wraper>
        );
    }
}

export default Registration
