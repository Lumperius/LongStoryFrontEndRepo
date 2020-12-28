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
    padding: 20px;
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
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();

    componentDidMount() {
        this.hubConnection.start();
        this.hubConnection.on("ReceiveMessage", messageText => {
            let message = {};
            message.text = messageText;
            message.user = this.props.token.login;
            message.timePosted = new Date(Date.now()).toLocaleTimeString()
            let state = this.state;
            state.MessageList.unshift(message);
            this.setState(state)
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleClick = (event) => {
        if (this.state.messageText !== '')
            this.hubConnection.invoke('SendMessage', this.state.messageText)
                .then(message => {
                    this.setState({
                        messageText: ''
                    })
                })
                .catch(error => {
                    console.log(error.toString())
                })
    }





    render() {
        return (<this.Wraper style={{ width: "600px" }}>
            {this.state.MessageList.map(message => {
                return <this.MessageWrapper>
                <div style={{ width: "400px" }}><Typography variant="subtitle" style={{ wordWrap: "break-word" }}>{message.text} </Typography></div>
                    <Typography variant="caption" style={{ float: "right" }}>by {message.user}-{message.timePosted}</Typography>
                    </this.MessageWrapper>
            })}<br/>
            <TextField name="messageText" value={this.state.messageText} onChange={this.handleChange} />
            <Button type="submit" onClick={this.handleClick} id="button"> Send </Button>
            {renderMessage(this.state.message.body, this.state.message.type)}
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(ChatHub)
