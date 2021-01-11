import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Input from '@material-ui/core/Input';
import renderMessage from '../../message';
import * as signalR from "@microsoft/signalr";
import connectToHub from '../../hubConnection';


class PrivateDialog extends React.Component {
    constructor() {
        super()
        this.state = {
            open: false,
            message: {
                body: '',
                type: ''
            },
            messageText: '',
            MessageList: [],
        }
    }

    hubConnection;

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
            this.hubConnection = await connectToHub()
        })().then(() => {
            this.setState({
                open: true
            })
            this.hubConnection.invoke('ConnectToHub', this.props.token.login)
            this.hubConnection.on('Message', recievedMessage => {
                let message = JSON.parse(recievedMessage);
                message.timePosted = new Date(message.timePosted).toLocaleDateString() + ' '
                    + new Date(message.timePosted).toLocaleTimeString();
                let state = this.state;
                state.MessageList.unshift(message);
                this.setState(state);
            })
        });
    }




    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        if (this.state.messageText !== '' &&
            this.state.messageText.length <= 1000) {
            let messageObject = {
                text: this.state.messageText,
                user: this.props.token.login,
                timePosted: Date.now()
            };
            let msg = JSON.stringify(messageObject)
            this.hubConnection.invoke('SendPrivateMessage', msg, this.props.dialog.targetUser)
                .then(message => {
                    messageObject.timePosted = new Date(messageObject.timePosted).toLocaleDateString() + ' '
                        + new Date(messageObject.timePosted).toLocaleTimeString();
                    debugger
                    let MessageList = this.state.MessageList;
                    MessageList.unshift(messageObject);
                    this.setState({
                        MessageList: MessageList,
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


    renderMessageBlock = (message) => {
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
        return (<Popper open={this.props.dialog.open}>
            <this.Wraper>
                {this.props.dialog.targetUser}<br />
                <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
                    {this.state.MessageList.map(message => {
                        return <>
                            {this.renderMessageBlock(message)}
                        </>
                    })}
                </div>

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
        dialog: state.dialog.dialogInfo
    };
}

export default connect(mapStateToProps)(PrivateDialog)
