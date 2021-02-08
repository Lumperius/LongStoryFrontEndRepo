import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import renderMessage from '../../message';
import * as signalR from "@microsoft/signalr";
import connectToHub from '../../hubConnection';
import setDialog from '../../Actions/setDialog';
import setDialogHistory from '../../Actions/setDialogHistory';

import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Input from '@material-ui/core/Input';
import addUnreadMessage from '../../Actions/addUnreadMessage';
import removeUnreadMessage from '../../Actions/removeUnreadMessage';
import Wrapper, { backendDomain } from '../../objects';


class PrivateDialog extends React.Component {
    constructor() {
        super()
        this.state = {
            //hidden: false,
            open: false,
            message: {
                body: '',
                type: ''
            },
            messageText: '',
            MessageList: [],
        }
    }
    //Connection to web socket
    hubConnection;

    MessageBlock = styled.div`
    margin: 0px;
    border-radius: 10px;
    max-height: 50vh;
    width: 100%;
    overflow-y: scroll;
    `;
    HiddenWrapper = styled.div`
    max-width: 15vw;
    max-height: 80vh;
    margin: 10px;
    padding: 5px;
    font-size: 18px;
    border-style: solid;
    border-width: 1px;
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
        this.connectToHub();
    }

    connectToHub = () => {
        try {
            (async () => {
                this.hubConnection = await connectToHub(`${backendDomain}/messenger/chat`)
            })().then(() => this.registerHandlers())
        }
        catch {
            setTimeout(this.connectToHub(), 10000)
        }
    }

    registerHandlers = () => {
        this.hubConnection.invoke('ConnectToHub', this.props.token.login)
        this.hubConnection.on('Message', recievedMessage => {
            if (recievedMessage === 'User is not active') {
                this.setState({
                    message: {
                        body: 'This user is currently unavailable. Message is not sent',
                        type: 'error'
                    }
                })
            }
            else {
                let message = JSON.parse(recievedMessage);
                message.timePosted = new Date(message.timePosted).toLocaleTimeString() +
                    + ' ' + new Date(message.timePosted).toLocaleDateString()
                if (message.user === this.props.dialog.dialogInfo.targetUser) {
                    let state = this.state;
                    state.MessageList.unshift(message);
                    this.setState(state);
                }
                this.addMessageToStore(message, message.user);
                if (message.user !== this.props.dialog.dialogInfo.targetUser && message.user !== this.props.token.login) {
                    this.props.addUnreadMessage(message.user)
                }
            }
        })
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.dialog.dialogInfo.targetUser !== nextProps.dialog.dialogInfo.targetUser) {
            this.props.removeUnreadMessage(nextProps.dialog.dialogInfo.targetUser);
            const refList = this.props.dialog?.UserDialogs?.find(dialog =>
                dialog.user === nextProps.dialog.dialogInfo.targetUser) || [];
            let nextDialog = {};
            Object.assign(nextDialog, refList);
            this.setState({
                message: {
                    body: '',
                    type: ''
                },
                MessageList: [...nextDialog?.MessageList || []],
                messageText: ''
            })
        }
        return true
    }

    componentDidUpdate() {
        if (!this.props.token) {
            this.hubConnection.invoke('DisconnectFromHub', this.props.token.login);
            this.hubConnection.stop();
        }
    }

    addMessageToStore = (message, user) => {
        let MessageList = [...this.props.dialog?.UserDialogs?.find(ml => ml.user === user)?.MessageList || []];
        MessageList.unshift(message);
        const dialogHistory = {
            user: user,
            MessageList: MessageList
        }
        this.props.setDialogHistory(dialogHistory);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleOpen = () => {
        this.setState({
            hidden: false
        })
    }

    handleClose = () => {
        const dialog = {
            targetUser: null,
            open: false
        }
        this.props.setDialog(dialog)
    }

    handleSubmit = (event) => {
        if (this.state.messageText !== '' &&
            this.state.messageText.length <= 1000) {
            const messageObject = {
                text: this.state.messageText,
                user: this.props.token.login,
                timePosted: Date.now()
            };
            const msg = JSON.stringify(messageObject)
            if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                this.setState({
                    message: {
                        body: '',
                        type: ''
                    }
                })
                this.hubConnection.invoke('SendPrivateMessage', msg, this.props.dialog.dialogInfo.targetUser)
                    .then(response => {
                        messageObject.timePosted = new Date(messageObject.timePosted).toLocaleTimeString()
                            + ' ' + new Date(messageObject.timePosted).toLocaleDateString()
                        this.addMessageToStore(messageObject, this.props.dialog.dialogInfo.targetUser)
                        let state = this.state;
                        state.messageText = '';
                        state.MessageList.unshift(messageObject);
                        this.setState({ state })
                    })
                    .catch(error => {
                        console.log(error.toString())
                    })
            }
            else {
                (async () => {
                    this.hubConnection = await connectToHub('http://localhost:5002/messenger/chat')
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
                <Typography variant="subtitle1" style={{ wordBreak: "break-all" }}>{message.text} </Typography>
                <Typography variant="caption" style={{ float: "right", wordBreak: "break-all" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
        else
            return <div style={{ display: "flex" }}><this.MessageWrapper>
                <Typography variant="subtitle1" style={{ wordBreak: "break-all" }}>{message.text} </Typography>
                <Typography variant="caption" style={{ float: "right", wordBreak: "break-all" }}> {message.user} at {message.timePosted}</Typography>
            </this.MessageWrapper><br /></div>
    }

    render() {
        return (<>
            <Popper open={this.props.dialog.dialogInfo.open}
                style={{ position: "fixed", top: "10%", left: "80%" }}>
                <Wrapper>
                    <CloseIcon style={{ float: "right", color: "darkred" }} onClick={this.handleClose} />
                    <Typography variant="h5">Chat with {this.props.dialog.dialogInfo.targetUser || "Unknown"}</Typography><br />
                    <Input name="messageText"
                        rowsMax="4"
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
                </Wrapper>
            </Popper>
        </>
        )
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
            dispatch(setDialogHistory(dialogHistory))
        },
        setDialog: dialog => {
            dispatch(setDialog(dialog))
        },
        addUnreadMessage: fromUser => {
            dispatch(addUnreadMessage(fromUser))
        },
        removeUnreadMessage: fromUser => {
            dispatch(removeUnreadMessage(fromUser))
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PrivateDialog)