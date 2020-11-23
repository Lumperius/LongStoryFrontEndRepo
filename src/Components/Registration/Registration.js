import  React  from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';

class Registration extends React.Component{
    
    constructor(){
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
    margin:90px;
    font-size: 28px;
    `;
    Input = styled.input`
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

    checkInput = () =>{
        if(this.state.login.length < 8){ this.setState({
            message : 'Your login must be at least 8 symbols long'}
        );  return false}

        let emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(this.state.email)){ this.setState(prevState =>{
            return { message : 'This email is not valid'}
        }); return false}

        if(this.state.password.length < 8){ this.setState({
            message : 'Your password must be at least 8 symbols long'}
        ); return false}

        if(this.state.repeat_password !== this.state.password){ this.setState({
            message : 'Your repeat password must match your password'
        }); return true}
    }
    
    sendRequest = () => {
        if(this.checkInput()) return;
        const body = { 
            Login: this.state.login,
            Email: this.state.email,
            Password: this.state.password,
        };
        axiosSetUp().post('http://localhost:5002/api/register', body)
        .then (response => { 
            this.props.history.push('/');
        })
        .catch( error => {
            console.log(error);
        })

    };

    render() {
        return(
            <this.Wraper>
                <h2>Registration</h2>
                <this.ErrorMessage>{this.state.message}</this.ErrorMessage>
                 <form>
                         <this.Input name="login" type="text" onChange={this.handleChange}/>  <this.InputLabel>Login </this.InputLabel><br/>
                         <this.Input name="email" type="text" onChange={this.handleChange}/>  <this.InputLabel>Email </this.InputLabel><br/>
                         <this.Input name="password" type="password" onChange={this.handleChange}/>  <this.InputLabel>Password </this.InputLabel>
                         <this.Input name="repeat_password" type="password" onChange={this.handleChange}/>  <this.InputLabel>Repeat password </this.InputLabel><br/><hr/><br/>
                     <this.SubmitButton type="button" onClick={this.sendRequest}>Submit</this.SubmitButton>
                 </form>
                 <this.RegistrationLink href="/authentication">Already have an account?</this.RegistrationLink>
            </this.Wraper>
        );
    }
    }

export default Registration
