import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import setAvatar from '../../../Actions/setAvatar.js';
import renderMessage from '../../../message';


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

            inputLogin: null,
            inputFirstName: null,
            inputLastName: null,
            inputBirthday: null,
            avatarPath: '',

            avatar: null
        }
    }


    componentDidMount() {
        if (this.props.token === undefined)
            this.props.history.push('authentication');
        this.sendGetUserInfoRequest();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleImageLoadEvent = (result) => {
        this.setState({
            avatarPath: result
        });
    }

    handleImageChange = (event) => {
        this.setState({
            avatar: event.target.files[0]
        })
        var fr = new FileReader();

        fr.addEventListener('load',() => this.handleImageLoadEvent(fr.result), false);

        if (event.target.files[0]) {
            fr.readAsDataURL(event.target.files[0]);
        }

    }


    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        let formData = new FormData();
        if (this.state.avatar === null) {
            this.setState({
                message: {
                    body: 'You need to choose avatar before submitting it.',
                    type: 'error'
                }
            })
            return;
        }
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
        if(!this.state.inputLogin && !this.state.inputFirstName &&
             !this.state.inputLastName && !this.state.inputBirthday)
             return;

        let userId = this.props.token.id;
        let body = {
            userId: userId,
            login: this.state.inputLogin,
            firstName: this.state.inputFirstName,
            lastName: this.state.inputLastName,
            birthDay: new Date(this.state.inputBirthday).toISOString()
        }
        axiosSetUp().post(`http://localhost:5002/userInfo/setInfo`, body)
            .then(response => {
                let state = this.state;
                state.info.login = this.state.inputLogin;
                state.info.firstName = this.state.inputFirstName;
                state.info.lastName = this.state.inputLastName;
                state.message = {
                    body: response.data,
                    type: 'success'
                }
                this.setState(state)
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

    renderAvatarSelction = () => {
        if (this.state.avatar) {
            return <form onSubmit={this.handleSubmit}>
                <img src={this.state.avatarPath} width="40px" height="40px" /><br />
                <TextField id="image" type="file" label="Change avatar" accept="image/png, image/jpeg" onChange={this.handleImageChange} /><br />
                <Button variant="outlined" type="submit" on>Change avatar</Button>
            </form>
        }
        if(this.props.avatar) {
            return <form onSubmit={this.handleSubmit}>
                <Typography variant="subtitle1">CURRENT AVATAR</Typography>
                <img src={`data:image/jpeg;base64,${this.props.avatar}`} width="40px" height="40px" /><br />
                <TextField id="image" type="file" label="Change avatar" accept="image/png, image/jpeg" onChange={this.handleImageChange} /><br />
            </form>
        }
    }

    render() {
        return (
            <>
                <Typography variant="title1">Your info</Typography><br /><br />
                <Typography variant="subtitle1" >LOGIN: {this.state.info.login}</Typography>
                <TextField name="inputLogin" label="Change login" onChange={this.handleChange} /><br />
                <Typography variant="subtitle1">EMAIL: {this.state.info.email}</Typography>
                <Typography variant="subtitle1">ROLE: {this.state.info.role}</Typography>
                <Typography variant="subtitle1">FIRST AND SECOND NAME: {this.state.info.firstName} {this.state.info.lastName}</Typography>
                <TextField name="inputFirstName" label="First name" onChange={this.handleChange} style={{ width: "100px" }} />
                <TextField name="inputLastName" label="Last name" onChange={this.handleChange} style={{ width: "100px" }} /><br /><br />
                <Typography variant="subtitle1">BIRTHDAY: {this.state.info.birthDay}</Typography>
                <TextField name="inputBirthday" type="date" onChange={this.handleChange} /><br />
                <Typography variant="subtitle1">REGISTERED: {this.state.info.dateRegistered}</Typography>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Button variant="outlined" onClick={this.sendPostUserInfoRequest}>Edit</Button><hr />
                {this.renderAvatarSelction()}
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAvatar: avatar => dispatch(setAvatar(avatar))
    };
};

const mapStateToProps = state => {
    return {
        avatar: state.avatar.avatar || 'default',
        token: state.token.tokenObj
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)