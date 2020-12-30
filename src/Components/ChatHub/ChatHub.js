import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import * as signalR from "@microsoft/signalr";
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';


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

    Wraper = styled.div`
    text-align:left;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-radius: 10px;
    border-color: dark;
    background-color: white;
    `;
    MessageWrapper = styled.div`
    text-align:left;
    width: 60vw;
    padding: 10px;
    margin: 5px;
    border-style: solid;
    border-width: 1px;
    border-radius: 10px;
    border-color: grey;
    background-color: WhiteSmoke;
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

        this.hubConnection.start();
        this.hubConnection.on('Message', recievedMessage => {
            let message = JSON.parse(recievedMessage);
            let state = this.state;
            state.MessageList.unshift(message);
            this.setState(state)
        })                 
        console.log(this.hubConnection.connectionId)    
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleClick = (event) => {
        if (this.state.messageText !== '' &&
        this.state.messageText.length <= 300 ) {
            let messageObject = {
                text: this.state.messageText,
                user: this.props.token.login,
                timePosted: new Date(Date.now()).toLocaleTimeString()
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
        else{
            this.setState({
                message:{
                    body: 'Incorrect message. Must be text 1-300 symbols long.',
                    type: 'error'
                }
            })
        }
    }


    renderMessage = (message) => {
        if (message.user === this.props.token.login)
            return <div style={{display: "flex"}}><this.MessageWrapper style={{ backgroundColor: "OldLace"}}>
                <Typography variant="subtitle" style={{ wordWrap: "break-word"}}>{message.text} </Typography><hr/>
                <Typography variant="caption" style={{ float: "left" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br/></div>
        else
            return <div style={{display: "flex"}}><this.MessageWrapper>
                <Typography variant="subtitle" style={{ wordWrap: "break-word" }}>{message.text} </Typography><hr/>
                <Typography variant="caption" style={{ float: "left" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br/></div>
    }

    render() {
        return (<this.Wraper style={{ height: "90vh", overflowY: "auto" }} >
            {this.state.MessageList.map(message => {
                return <>
                    {this.renderMessage(message)}
                </>
            })}
            <br />
            <Input name="messageText" 
            multiline={true}
            inputProps={{ maxLength: 300 }} 
            value={this.state.messageText} 
            onChange={this.handleChange}
            style={{width: "20vw"}} />
            {renderMessage(this.state.message.body, this.state.message.type)}<br/>
            <Button type="submit" onClick={this.handleClick} id="button"> Send </Button>
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(ChatHub)
