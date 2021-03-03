import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../message';
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import toolbar from '../../../toolBarConfig';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axiosSetUp from '../../../axiosConfig';
import buildRequest from '../../../helpers';

class RedactPartEditor extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            editorState: EditorState.createEmpty(),
            deleteAwaitingConfirm: false
        }
    }

    componentDidMount() {
        this.setState({
            editorState: EditorState?.createWithContent(convertFromRaw(JSON.parse(this.props.textPart?.textPartBody) || null)) || this.handleInvalidEditor
        })
    }

    handleInvalidEditor = () => {
        this.setState({
            message: {
                body: 'Error occured while trying to open editor, try again later.',
                type: 'error'
            }
        })
        return null;
    }

    sendEditTextPartRequest = () => {
        const textPartBody = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
        if (!this.isInputValid(textPartBody)) {
            this.props.textPartEdited();
            return;
        }
        const body = {
            authorId: this.props.token.id,
            authorLogin: this.props.token.login,
            textPartId: this.props.textPart.textPartId,
            textPartBody: textPartBody
        }
        axiosSetUp().put(buildRequest('/textPart'), body)
            .then(response => {
                const textPart = {
                    textPartId: this.props.textPart.textPartId,
                    textPartBody: textPartBody
                }
                this.props.textPartEdited(textPart)
                this.setState({
                    message: {
                        body: 'Edited successfully',
                        type: 'success'
                    }
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while editing text, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    sendDeleteTextPartRequest = () => {
        const queryData = {
            textPartId: this.props.textPart.textPartId
        }
        axiosSetUp().delete(buildRequest('/textPart', queryData))
            .then(response => {
                this.props.textPartDeleted(this.props.textPart)
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while deleting text part, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    isInputValid = (textPartBody) => {
        const plainText = this.state.editorState.getCurrentContent().getPlainText()
        if (plainText.length === 0 || plainText.trim() === '') {
            this.setState({
                message: {
                    body: 'Text is required.',
                    type: 'error'
                }
            })
            return false;
        }
        const imgRegex = new RegExp('<img.+?>')
        if (imgRegex.test(plainText)) {
            this.setState({
                message: {
                    body: 'Images are not allowed in text of the book.',
                    type: 'error'
                }
            })
            return false;
        }
        if (textPartBody === this.props.textPart.textPartBody)
            return false;
        else return true;
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }

    renderDeleteButton = () => {
        if (this.state.deleteAwaitingConfirm)
            return <>
                <Typography variant="subtitle2" style={{display: "inline", margin: "10px"}}>Are you sure?</Typography>
                <Button size="small" variant="contained" style={{margin: "5px"}} onClick={() => this.sendDeleteTextPartRequest()}>Yes</Button>
                <Button size="small" variant="contained" style={{margin: "5px"}} onClick={() => this.setState({ deleteAwaitingConfirm: false })}>No</Button>
            </>
        else
            return <Button variant="contained" style={{margin: "10px"}} onClick={() => this.setState({ deleteAwaitingConfirm: true })}>Delete</Button>
    }


    render() {
        return (<>
            <div style={{ backgroundColor: "GhostWhite" }}>
                <Editor
                    name="body"
                    toolbar={toolbar}
                    onEditorStateChange={this.onEditorStateChange}
                    handlePastedText={() => { }}
                    editorState={this.state.editorState}
                />
                {renderMessage(this.state.message.body, this.state.message.type)}
            </div>
            <Button variant="contained" color="primary" onClick={() => this.sendEditTextPartRequest()}>Edit</Button>
            {this.renderDeleteButton()}
        </>)
    };
};

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
};

export default connect(mapStateToProps)(RedactPartEditor);