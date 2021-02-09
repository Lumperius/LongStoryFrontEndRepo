import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import * as signalR from "@microsoft/signalr";
import Input from '@material-ui/core/Input';
import connectToHub from '../../hubConnection';
import Wrapper, { backendDomain } from '../../objects';

const MAX_MESSAGE_LENGTH = 1000;

class ChatHub extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            messageText: '',
            MessageList: []
        }
    }

    //Connection to web socket
    hubConnection;

    MessageWrapper = styled.div`
    text-align:left;
    width: 100%;
    padding: 5px;
    margin: 5px;
    border-style: solid;
    border-width: 1px;
    border-radius: 10px;
    border-color: grey;
    background-color: WhiteSmoke;
    `;
    HrLine = styled.hr`
    border-top: 1px solid lightgrey;
    margin: 0px;
    `;


    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
        (async () => {
            this.hubConnection = await connectToHub(`${backendDomain}/messenger/chatroom`)
        })().then(() => {
            this.hubConnection.on('Message', recievedMessage => {
                let message = JSON.parse(recievedMessage);
                message.timePosted = new Date(message.timePosted).toLocaleTimeString() + ' ' +
                    new Date(message.timePosted).toLocaleDateString();
                let state = this.state;
                state.MessageList.unshift(message);
                this.setState(state)
            })
        })
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        if (this.state.messageText !== '' &&
            this.state.messageText.length <= MAX_MESSAGE_LENGTH) {
            const messageObject = {
                text: this.state.messageText,
                user: this.props.token.login,
                timePosted: Date.now()
            }
            JSON.stringify()
            if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                this.hubConnection.invoke('PublishMessage', JSON.stringify(messageObject))
                    .then(message => {
                        this.setState({
                            messageText: ''
                        })
                    })
                    .catch(error => {
                        (async () => {
                            this.hubConnection = await connectToHub(`${backendDomain}/messenger/chatroom`)
                        })()
                        this.setState({
                            message: {
                                body: 'There was an error while sending the message. Try again later.',
                                type: 'error'
                            }
                        })
                    })
            }
            else {
                (async () => {
                    this.hubConnection = await connectToHub(`${backendDomain}/messenger/chatroom`)
                })()
                this.setState({
                    message: {
                        body: 'Error with connection occured. Try again later.',
                        type: 'error'
                    }
                })
            }
        }
        else {
            this.setState({
                message: {
                    body: `Incorrect message. Must be text 1-${MAX_MESSAGE_LENGTH} symbols long.`,
                    type: 'error'
                }
            })
        }
    }


    renderMessage = (message) => {
        if (message.user === this.props.token.login)
            return <div style={{ display: "flex" }}><this.MessageWrapper style={{ backgroundColor: "OldLace" }}>
                <Typography variant="subtitle1" style={{ wordBreak: "break-all" }}>{message.text} </Typography><this.HrLine />
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
        else
            return <div style={{ display: "flex" }}><this.MessageWrapper>
                <Typography variant="subtitle1" style={{ wordBreak: "break-all" }}>{message.text} </Typography><this.HrLine />
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
    }

    render() {
        return (<Wrapper style={{ height: "90vh", overflowY: "auto" }} >
            {this.state.MessageList.map(message => {
                return <>
                    {this.renderMessage(message)}
                </>
            })}
            <br />
            <Input name="messageText"
                multiline={true}
                inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
                value={this.state.messageText}
                onChange={this.handleChange}
                style={{ width: "20vw" }} />
            {renderMessage(this.state.message.body, this.state.message.type)}<br />
            <Button type="submit" onClick={this.handleSubmit} id="button"> Send </Button>
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(ChatHub)
