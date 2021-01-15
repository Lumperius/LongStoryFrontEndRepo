import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import setDialog from '../../Actions/setDialog'

class UserInfoWindow extends React.Component {
    constructor() {
        super()
        this.state = {
            userInfo: {},
            userId: '',
            message: {
                body: '',
                type: ''
            }
        }
    }

    Wraper = styled.div`
    text-align: left;
    margin: 30px;
    padding: 20px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    background-color: white;
    `;


    componentDidMount() {
        this.sendGetUserInfoRequest();
    }

    componentDidUpdate() {
        if (this.state.userId === this.props.userId) { return true; }
        this.sendGetUserInfoRequest();
    }

    sendGetUserInfoRequest = () => {
        this.setState({
            userId: this.props.userId
        })
        axiosSetUp().get(`http://localhost:5002/userInfo/get?userId=${this.props.userId}`)
            .then(response => {
                this.setState({
                    userInfo: response.data || null,
                })
            })
            .catch(error => {
                this.setState({
                    userInfo:  null,
                    message: {
                        body: error.data.title,
                        type: 'error'
                    }
                })
            })
    }

    handleWhisper = () => {
        if (this.state.userInfo) {
            let dialog = {
                open: true,
                targetUser: this.state.userInfo.login
            }
            this.props.setDialog(dialog)
        }
    }

    renderStartChatLink = () => {
        if (this.props.token && this.props.userId !== this.props.token.id) {
            return <>
                <Typography variant="text" onClick={this.handleWhisper} style={{ cursor: "pointer", textDecoration: "underline", fontSize: "20px" }}>Start chat</Typography>
            </>
        }
    }

    renderUserInfo = () => {
        if (this.props.userId && this.state.userInfo && this.state.userInfo !== 'User not found') {
            return <>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Typography variant="subtitle1">
                    {this.state.userInfo.role || null} {this.state.userInfo.login || null}<br />
                Name: {this.state.userInfo.firstName || null} {this.state.userInfo.secondName || 'unknown'}<br />
                Birthday: {this.state.userInfo.birtDay || null}<br />
                Registered: {this.state.userInfo.dateRegistered || ''}<br />
                </Typography>
                {this.renderStartChatLink()}
            </>
        }
        else {
            return <>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Typography variant="subtitle1">User could not be found</Typography>
            </>
        }
    }


    render() {
        return (
            <this.Wraper>
                {this.renderUserInfo()}
            </this.Wraper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

const mapDispatchToProps = dispatch => {   
    return {
        setDialog: dialog =>{
            dispatch(setDialog(dialog))},
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserInfoWindow)
