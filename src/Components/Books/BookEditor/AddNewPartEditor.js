import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../message';
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertToRaw } from 'draft-js';
import toolbar from '../../../toolBarConfig';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axiosSetUp from '../../../axiosConfig';
import buildRequest from '../../../helpers';

class AddNewPartEditor extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            editorState: EditorState.createEmpty(),
        }
    }


    sendAddTextPartRequest = () => {
        if (!this.isInputValid()) return;
        const partBody = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
        const body = {
            bookId: this.props.bookId,
            authorId: this.props.token.id,
            body: partBody,
            authorLogin: this.props.token.login,
        }
        if (this.props.previousTextPartId)
            body.previousPartId = this.props.previousTextPartId

        axiosSetUp().post(buildRequest('/textPart'), body)
            .then(response => {
                const textPart = {
                    textPartId: response.data.textPartId,
                    textPartBody: partBody
                };
                this.props.closeEditor();
                this.props.textPartCreated(textPart);
                this.setState({
                    message: {
                        body: 'Added successfully.',
                        type: 'success'
                    }
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while adding text part, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    isInputValid = () => {
        const plainText = this.state.editorState.getCurrentContent().getPlainText()
        if (plainText.length === 0 || plainText.trim() === '') {
            this.setState({
                message: {
                    body: 'Text of the text part connot be empty.',
                    type: 'error'
                }
            })
            return false;
        }
        const imgRegex = new RegExp('<img.+?>')
        if(imgRegex.test(plainText)){
            this.setState({
                message: {
                    body: 'Images are not allowed in text of the book.',
                    type: 'error'
                }
            })
            return false;
        }
        return true;
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }


    render() {
        return (<>
            <Editor
                name="body"
                toolbar={toolbar}
                onEditorStateChange={this.onEditorStateChange}
                handlePastedText={() => { }}
            />
            <Typography variant="subtitle2">{this.state.editorState.getCurrentContent().getPlainText().length}</Typography><br />
            <Button variant="contained" color="primary" size="large" onClick={() => this.sendAddTextPartRequest()}>
                Add
            </Button>
            {renderMessage(this.state.message.body, this.state.message.type)}
        </>)
    };
};

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
};

export default connect(mapStateToProps)(AddNewPartEditor);