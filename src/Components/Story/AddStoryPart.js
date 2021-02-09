import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from 'draft-js-export-html';
import buildQuery from '../../helpers';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';


const MAX_STORYPART_LENGTH_PLAIN = 1000;
const MIN_STORYPART_LENGTH_PLAIN = 20;

class AddStoryPart extends React.Component {

    constructor() {
        super();
        this.state = {
            editorState: EditorState.createEmpty(),
            message: {
                body: '',
                type: ''
            },
        }
    }

    BodyInput = styled.textarea`
    text-indent: 20px;
    padding: 5px;
    width: 80%;
    height: 500px;
    font-size: 20px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
    ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    `;
   

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }

    handleBeforeInput = () => {
        if (this.state.editorState.getCurrentContent().getPlainText().length >= MAX_STORYPART_LENGTH_PLAIN)
            return 'handled'
    }

    handlePastedText = (pastedText) => {
        if (this.state.e)
        if (this.state.editorState.getCurrentContent().getPlainText().length + pastedText.length > MAX_STORYPART_LENGTH_PLAIN)
            return 'handled'
    }



    validateRequestParametrs = () => {
        if (!this.state.editorState || this.state.editorState.getCurrentContent().getPlainText().length < MIN_STORYPART_LENGTH_PLAIN ||
            this.state.editorState.getCurrentContent().getPlainText().body >= MAX_STORYPART_LENGTH_PLAIN) {
            this.setState({
                message: {
                    body: 'Incorrect text of the story part.',
                    type: 'error'
                }
            })
            return false;
        }
        const imgRegex = new RegExp('<img.+?>')
        const htmlText = stateToHTML(this.state.editorState.getCurrentContent())
        if(imgRegex.test(htmlText)){
            this.setState({
                message: {
                    body: 'Images are not allowed in story text.',
                    type: 'error'
                }
            })
            return false;
        }
        return true;
    }

    sendNewStoryPartRequest = () => {
        if (!this.validateRequestParametrs()) return;
        const requestBody = {
            storyId: this.props.storyId,
            authorId: this.props.token.id,
            body: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post(buildQuery('/storyPart/create'), requestBody)
            .then(response => {
                this.props.stopRenderEditor();
                this.setState({
                    message: {
                        body: response.data,
                        type: 'success'
                    },
                    editorState: EditorState.createEmpty()
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    message: {
                        body: 'Error ocured while submitting story part',
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return <>
            <Editor
                name="body"
                onEditorStateChange={this.onEditorStateChange}
                handlePastedText={this.handlePastedText} 
                handleBeforeInput={this.handleBeforeInput}/>
            <Typography variant="subtitle2">{this.state.editorState.getCurrentContent().getPlainText().length}/{MAX_STORYPART_LENGTH_PLAIN}</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button variant="contained" color="primary" onClick={this.sendNewStoryPartRequest}>submit</Button>
        </>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(AddStoryPart)