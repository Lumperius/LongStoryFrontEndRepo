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
            inputLogin: '',
            inputFirstName: '',
            inputLastName: '',
            avatar: null
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

    handleImageChange = (event) => {
        debugger
        this.setState({
            avatar: event.target.files[0]
        })
    }

    
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        let formData = new FormData();
        formData.append('avatar', this.state.avatar, 'this.state.image.name');
        formData.append('title', '');
        formData.append('content', '');
        let url = `http://localhost:5002/userInfo/setAvatar?userId=${this.props.token.id}`;
        axiosSetUp().post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
              }
        })
            .then(response => {
              console.log(response.data);
            })
            .catch(err => console.log(err))
      };


    sendGetUserInfoRequest = () => {
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/userInfo/getInfo?userId=${userId}`)
            .then(response => {
                this.setState({
                    info: response.data,
                    login: response.data.login,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            })
            .catch(error => {
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
                let state = this.state;
                state.info.login = this.state.inputLogin;
                state.info.firstName = this.state.inputFirstName;
                state.info.lastName = this.state.inputLastName;

                this.setState(state)
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

    renderAvatar = () =>{
        var state = this.state;
        debugger
        return<img src={`data:image/jpeg;base64,${this.state.info.avatar}`} />
    }

    render() {
        return (
            <this.Wraper>
            {this.renderMessage()}
                <Typography variant="title1">Your info</Typography><br /><br />
                <Typography variant="subtitle1" >LOGIN: {this.state.info.login}</Typography>
                <TextField name="inputLogin" label="Change login" onChange={this.handleChange}/><br />
                <Typography variant="subtitle1">EMAIL: {this.state.info.email}</Typography>
                <Typography variant="subtitle1">ROLE: {this.state.info.role}</Typography>
                <Typography variant="subtitle1">FIRST AND SECOND NAME: {this.state.info.firstName} {this.state.info.lastName}</Typography> 
                <TextField name="inputFirstName" label="First name" onChange={this.handleChange} style={{ width: "100px" }}/>
                <TextField name="inputLastName" label="Last name" onChange={this.handleChange} style={{ width: "100px" }}/><br /><br />
                <Typography variant="subtitle1">BIRTHDAY: {this.state.info.birthDay}</Typography>
                <Typography variant="subtitle1">REGISTERED: {this.state.info.dateRegistered}</Typography>
                <Button variant="outlined" onClick={this.sendPostUserInfoRequest}>Edit</Button><hr />
                {this.renderAvatar()}
                <form onSubmit={this.handleSubmit}>
                   <Typography variant="subtitle1">CURRENT AVATAR</Typography>
                   <TextField id="image" type="file" label="Change avatar" accept="image/png, image/jpeg"onChange={this.handleImageChange}/><br />
                   <Button variant="outlined" type="submit" on>Change avatar</Button>
                </form>

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