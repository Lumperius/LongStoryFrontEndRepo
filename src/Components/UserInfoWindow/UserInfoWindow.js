import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import setDialog from '../../Actions/setDialog'
import Wrapper from '../../objects';
import buildQuery from '../../helpers';

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
        const queryData = {
            userId: this.props.userId
        }
        axiosSetUp().get(buildQuery('/userInfo/get', queryData))
            .then(response => {
                this.setState({
                    userInfo: response.data || null,
                })
            })
            .catch(error => {
                this.setState({
                    userInfo:  null,
                    message: {
                        body: 'Error occured while downloading user information',
                        type: 'error'
                    }
                })
            })
    }

    handleWhisper = () => {
        if (this.state.userInfo) {
            const dialog = {
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
            <Wrapper>
                {this.renderUserInfo()}
            </Wrapper>
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
