import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';


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
    SubmitButton = styled.button`
    `;
    ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    `;
    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: dark;
    background-color: white:
    `;


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }


    validateRequestParametrs = () => {
        if (!this.state.editorState || this.state.editorState.getCurrentContent().getPlainText().length < 20 || 
        this.state.editorState.getCurrentContent().getPlainText().body >= 4000) {
            this.setState({ message:{
                body: 'Incorrect text of the story part.',
                type: 'error'
                } 
            })
            return false;
        }
        return true;
    }

    sendNewStoryPartRequest = () => {
        if (!this.validateRequestParametrs()) return;
        let requestBody = {
            storyId: this.props.storyId,
            authorId: this.props.token.id,
            body: stateToHTML(this.state.editorState.getCurrentContent()),
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post('http://localhost:5002/storyPart/create', requestBody)
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
                        body: error.data || [],
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return <>
            <Editor name="body" onEditorStateChange={this.onEditorStateChange} />
            <Typography variant="subtitle2">{this.state.editorState.getCurrentContent().getPlainText().length}/4000</Typography>
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