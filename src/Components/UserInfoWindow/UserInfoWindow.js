import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';

class UserInfoWindow extends React.Component {
    constructor() {
        super()
        this.state = {
            userInfo: {},
            message: {
                body: '',
                type: ''
            }
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:10px;
    padding: 10px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    border-radius: 5px;
    background-color: white;
    `;


    componentDidMount() {
        this.sendGetUserInfoRequest();
    }

    sendGetUserInfoRequest = () => {
        axiosSetUp().get(`http://localhost:5002/userInfo/get?userId=${this.props.userId}`)
            .then(response => {
                this.setState({
                    userInfo: response.data
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: error.data.title,
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return (
            <this.Wraper>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Typography variant="subtitle1">
                    {this.state.userInfo.role} {this.state.userInfo.login}<br />
                    Name: {this.state.userInfo.firstName || 'unknown'} {this.state.userInfo.secondName || 'unknown'}<br />
                    Birthday: {this.state.userInfo.birtDay || 'unknown'}<br />
                    Registered: {this.state.userInfo.dateRegistered}
                </Typography>
            </this.Wraper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(UserInfoWindow)
