import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class Info extends React.Component {

    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            showEditor: false,
            info: {},
            login: '',
            firstName: '',
            lastName: ''
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin:30px;
    padding: 50px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 20px;
    border-color: lightgrey;
    `;

    componentDidMount() {
        this.sendGetUserInfoRequest();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    sendGetUserInfoRequest = () => {
        let token = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/userInfo/getInfo?userId=${token}`)
            .then(response => {
                this.setState({
                    info: response.data,
                    login: response.data.login,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            })
            .catch(error => {
                console.log(error.response.data);
                this.setState({
                    message: {
                        body: error.data,
                        type: 'error'
                    }
                })
            });
    }

    sendPostUserInfoRequest = () => {
        let userId = this.props.token.id;
        let body = {
            userId: userId,
            login: this.state.login,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        axiosSetUp().post(`http://localhost:5002/userInfo/setInfo`, body)
            .then(response => {
                this.setState()
            })
            .catch(error => {
                console.log(error.response.data);
                this.setState({
                    message: {
                        body: error.data,
                        type: 'error'
                    }
                })
            });
    }

    renderMessage = () =>{
        switch(this.state.message.type){
            case 'error':
        return <Typography variant="subtitle1" style={{ color: "red" }}>{this.state.message.body}</Typography>
            case 'info':
        return <Typography variant="subtitle1">{this.state.message.body}</Typography>
        }
    }

    render() {
        return (
            <this.Wraper>
            {this.renderMessage()}
                <Typography variant="title1">Your info</Typography><br /><br />
                <Typography variant="subtitle1" >Login: {this.state.info.login}</Typography>
                <TextField name="login" label="Change login" onChange={this.handleChange}/><br />
                <Typography variant="subtitle1">Email: {this.state.info.email}</Typography>
                <Typography variant="subtitle1">Role: {this.state.info.role}</Typography>
                <Typography variant="subtitle1">First and second name: {this.state.info.firstName} {this.state.info.lastName}</Typography> 
                <TextField name="firstName" label="First name" onChange={this.handleChange} style={{ width: "100px" }}/>
                <TextField name="lastName" label="Last name" onChange={this.handleChange} style={{ width: "100px" }}/><br /><br />
                <Typography variant="subtitle1">Birtday: {this.state.info.birthDay}</Typography>
                <Typography variant="subtitle1">Registered: {this.state.info.dateRegistered}</Typography><hr />
                <Button onClick={this.sendPostUserInfoRequest}>Edit</Button>
            </this.Wraper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Info)