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
            message: '',
            showEditor: false,
            info: {},
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
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            })
            .catch(error => {
                console.log(error.response.data);
                this.setState({ message: error.response.data });
            });
    }

    sendPostUserInfoRequest = () => {
        let userId = this.props.token.id;
        let body = {
            userId: userId,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        axiosSetUp().post(`http://localhost:5002/userInfo/setInfo`, body)
            .then(response => {
                this.setState()
            })
            .catch(error => {
                console.log(error.response.data);
                this.setState({ message: error.response.data });
            });
    }


    render() {
        return (
            <this.Wraper>
                <Typography variant="title1">Your info</Typography><br/><br/>
                <Typography variant="subtitle1">Login: {this.state.info.email}</Typography>
                <Typography variant="subtitle1">Email: {this.state.info.role}</Typography>
                <Typography variant="subtitle1">First and second name:</Typography>
                <TextField name="firstName" label={this.state.info.firstName} onChange={this.handleChange}/>
                <TextField name="lastName" label={this.state.info.lastName} onChange={this.handleChange} /><br/><br/>
                <Typography variant="subtitle1">Birtday: {this.state.info.birthDay}</Typography>
                <Typography variant="subtitle1">Registered: {this.state.info.dateRegistered}</Typography><hr/>
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