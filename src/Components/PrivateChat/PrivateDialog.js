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
import setDialog from '../../Actions/setDialog';
import setDialogHistory from '../../Actions/setDialogHistory';

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

    MessageBlock = styled.div`
    margin: 0px;
    border-radius: 10px;
    max-height: 50vh;
    width: 100%;
    overflow-y: scroll;
    `;
    Wraper = styled.div`
    border-radius: 25px;
    text-align: left;
    max-width: 15vw;
    max-height: 80vh;
    margin: 10px;
    padding: 15px;
    font-size: 28px;
    border-style: solid;
    border-width: 3px;
    border-color: dark;
    background-color: white;
    `;
    MessageWrapper = styled.div`
    text-align:left;
    max-width: 13vw;
    max-height: 100%;
    padding: 5px;
    margin: 5px;
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
            this.hubConnection.invoke('ConnectToHub', this.props.token.login)
            this.hubConnection.on('Message', recievedMessage => {
                if (recievedMessage === 'User is not active') {
                    this.setState({
                        message: {
                            body: 'This user is unavailable right now',
                            type: 'error'
                        }
                    })
                }
                else {
                    this.setState({
                        message: {
                            body: '',
                            type: ''
                        },
                        messageText: ''
                    })
                    let message = JSON.parse(recievedMessage);
                    message.timePosted = new Date(message.timePosted).toLocaleDateString() + ' '
                        + new Date(message.timePosted).toLocaleTimeString();
                    let state = this.state;
                    state.MessageList.unshift(message);
                    this.setState(state);
                }
            })
        });
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.dialog.dialogInfo.targetUser !== nextProps.dialog.dialogInfo.targetUser) {
            this.saveDialogIntoState();
            let refList = this.props.dialog.UserDialogs
                .find(dialog => dialog.user === nextProps.dialog.dialogInfo.targetUser) || [];
            let nextDialog = {}; 
            Object.assign(nextDialog, refList);
            this.setState({
                MessageList: [...nextDialog.MessageList || []],
                messageText: ''
            })
        }
        return true
    }

    componentDidUpdate() {
        if(!this.props.token){
            this.hubConnection.invoke('DisconnectFromHub', this.props.token.login);
            this.hubConnection.stop();
        }
    }

    saveDialogIntoState = () => {
        let dialogHistory = {
            user: this.props.dialog.dialogInfo.targetUser?.valueOf() || null,
            MessageList: [...this.state.MessageList],
        }
         this.props.setDialogHistory(dialogHistory)
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
            if (this.hubConnection.state === 'Connected') {
                this.hubConnection.invoke('SendPrivateMessage', msg, this.props.dialog.dialogInfo.targetUser)
                    .catch(error => {
                        console.log(error.toString())
                    })
            }
            else {
                (async () => {
                    this.hubConnection = await connectToHub()
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
                    body: 'Incorrect message. Must be text 1-1000 symbols long.',
                    type: 'error'
                }
            })
        }
    }


    renderMessageBlock = (message) => {
        if (message.user === this.props.token.login)
            return <div style={{ display: "flex" }}><this.MessageWrapper style={{ backgroundColor: "OldLace" }}>
                <Typography variant="subtitle1" style={{ wordWrap: "break-word" }}>{message.text} </Typography>
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
        else
            return <div style={{ display: "flex" }}><this.MessageWrapper>
                <Typography variant="subtitle1" style={{ wordWrap: "break-word" }}>{message.text} </Typography>
                <Typography variant="caption" style={{ float: "right" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
    }

    render() {
        return (<Popper open={this.props.dialog.dialogInfo.open}
            style={{ position: "fixed", top: "0%", left: "80%" }}>
            <this.Wraper>
                <Typography variant="h5">Chat with {this.props.dialog.dialogInfo.targetUser || "Unknown"}</Typography><br />
                <Input name="messageText"
                    multiline={true}
                    inputProps={{ maxLength: 1000 }}
                    value={this.state.messageText}
                    onChange={this.handleChange}
                    style={{ width: "15vw" }} />
                <Button type="submit" onClick={this.handleSubmit} id="button"> Send </Button>
                <this.MessageBlock>
                    {this.state.MessageList.map(message => {
                        return <>
                            {this.renderMessageBlock(message)}
                        </>
                    })}
                </this.MessageBlock>
                {renderMessage(this.state.message.body, this.state.message.type)}<br />
            </this.Wraper>
        </Popper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
        dialog: state.dialog
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setDialogHistory: dialogHistory => { 
            dispatch(setDialogHistory(dialogHistory))},
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(PrivateDialog)
