import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Input from '@material-ui/core/Input';
import renderMessage from '../../message';
import * as signalR from "@microsoft/signalr";


class PrivateChat extends React.Component {
    constructor() {
        super()
        this.state = {
            open: true,
            message: {
                body: '',
                type: ''
            },
            messageText: '',
            MessageList: []
        }
        this.hubConnection.start();
        this.hubConnection.on('Message', recievedMessage => {
            let message = JSON.parse(recievedMessage);
            message.timePosted = new Date(message.timePosted).toLocaleDateString() + ' '
                + new Date(message.timePosted).toLocaleTimeString();
            let state = this.state;
            state.MessageList.unshift(message);
            this.setState(state)
        })
    }

    Wraper = styled.div`
    text-align: left;
    margin: 10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    background-color: white;
    `;


    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5002/messenger/chat', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        })
        .build();

    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        debugger
        this.hubConnection.invoke('ConnectToHub', this.props.token.login)
        if (this.state.messageText !== '' &&
            this.state.messageText.length <= 1000) {
            let messageObject = {
                text: this.state.messageText,
                user: this.props.token.login,
                timePosted: Date.now()
            };
            JSON.stringify()
            this.hubConnection.invoke('PublishMessage', JSON.stringify(messageObject))
                .then(message => {
                    this.setState({
                        messageText: ''
                    })
                })
                .catch(error => {
                    console.log(error.toString())
                })
        }
        else {
            this.setState({
                message: {
                    body: 'Incorrect message. Must be text 1-1000 symbols long.',
                    type: 'error'
                }
            })
        }
    }


    renderMessage = (message) => {
        debugger
        if (message.user === this.props.token.login)
            return <div style={{ display: "flex" }}><this.MessageWrapper style={{ backgroundColor: "OldLace" }}>
                <Typography variant="subtitle1" style={{ wordWrap: "break-word" }}>{message.text} </Typography><this.HrLine />
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
        else
            return <div style={{ display: "flex" }}><this.MessageWrapper>
                <Typography variant="subtitle1" style={{ wordWrap: "break-word" }}>{message.text} </Typography><this.HrLine />
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
    }

    render() {
        return (<Popper open={this.state.open}>
            {this.state.MessageList.map(message => {
                return <>
                    {this.renderMessage(message)}
                </>
            })}
            <this.Wraper>
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Input name="messageText"
                    multiline={true}
                    inputProps={{ maxLength: 1000 }}
                    value={this.state.messageText}
                    onChange={this.handleChange}
                    style={{ width: "15vw" }} />
                {renderMessage(this.state.message.body, this.state.message.type)}<br />
                <Button type="submit" onClick={this.handleSubmit} id="button"> Send </Button>
            </this.Wraper>
        </Popper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(PrivateChat)
