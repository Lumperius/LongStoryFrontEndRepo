import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from 'draft-js-export-html';
import Wrapper from '../../objects';
import buildRequest from '../../helpers';
import { EditorState, convertToRaw } from 'draft-js';
import toolbar from '../../toolBarConfig';


const MAX_STORYPART_LENGTH = 1000;
const MIN_STORYPART_LENGTH = 20;
const MAX_TITLE_LENGTH = 50;

class InitializeStory extends React.Component {

    constructor() {
        super()
        this.state = {
            title: '',
            editorState: EditorState.createEmpty(),
            message: {
                body: '',
                type: ''
            },
        }
    }


    TitleInput = styled.textarea`
    text-indent: 20px;
    padding-left: 0px;
    padding-bottom: 0px;
    padding-top: 10px;
    margin-bottom: 10px;
    width: 80%;
    height: 50px;
    font-size: 30px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
    BodyInput = styled.textarea`
    text-indent: 20px;
    padding: 5px;
    width: 80%;
    height: 520px;
    font-size: 20px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
    SubmitButton = styled.button`
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    margin: 20px;
    `;
    InputLabel = styled.h3`
    font-size: 30px;
    margin: 20px;
    `;

    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
    }

    sendCreateStoryRequest = () => {
        if (!this.validateRequestParametrs()) return;
        const body = {
            userId: this.props.token.id,
            title: this.state.title,
            body: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
            author: this.props.token.login,
            authorId: this.props.token.id,
            dateSubmitted: new Date().toISOString()
        }

        axiosSetUp().post(buildRequest('/story/createStory'), body)
            .then(response => {
                this.setState({
                    message: {
                        body: response.data.message,
                        type: 'success'
                    },
                    title: '',
                    editorState: EditorState.createEmpty(),
                })
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    message: {
                        body: 'Error occured while creating the story',
                        type: 'error'
                    },
                })
            })
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }

    handleBeforeInput = () => {
        if (this.state.editorState.getCurrentContent().getPlainText().length >= MAX_STORYPART_LENGTH)
            return 'handled'
    }

    handlePastedText = (pastedText) => {
        if (this.state.editorState.getCurrentContent().getPlainText().length + pastedText.length > MAX_STORYPART_LENGTH)
            return 'handled'
    }

    validateRequestParametrs = () => {
        if (!this.state.title || this.state.title.length < 1 || this.state.title.length > MAX_TITLE_LENGTH) {
            this.setState({
                message: {
                    body: `Incorrect title. It must more than 1 and less than ${MAX_TITLE_LENGTH} symbols.`,
                    type: 'error'
                }
            });
            return false;
        }

        if (!this.state.editorState?.getCurrentContent() || this.state.editorState?.getCurrentContent().getPlainText().length < MIN_STORYPART_LENGTH ||
            this.state.editorState?.getCurrentContent().getPlainText().length >= MAX_STORYPART_LENGTH) {
            this.setState({
                message: {
                    body: `Incorrect text. It must more than ${MIN_STORYPART_LENGTH} and less than ${MAX_STORYPART_LENGTH} symbols.`,
                    type: 'error'
                }
            });
            return false;
        }
        const imgRegex = new RegExp('<img.+?>')
        const htmlText = stateToHTML(this.state.editorState.getCurrentContent())
        if (imgRegex.test(htmlText)) {
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


    render() {
        return (
            <Wrapper>
                <this.TitleInput name="title" maxLength={MAX_TITLE_LENGTH} placeholder="Enter a title" onChange={this.handleChange}></this.TitleInput><br />
                <Typography variant="subtitle2">{this.state.title.length}/{MAX_TITLE_LENGTH}</Typography><br />
                <Editor
                    name="body"
                    toolbar={toolbar}
                    placeholder="Type the beginning of story here"
                    onEditorStateChange={this.onEditorStateChange}
                    handleBeforeInput={this.handleBeforeInput}
                    handlePastedText={this.handlePastedText} />
                <Typography variant="subtitle2">{this.state.editorState.getCurrentContent().getPlainText().length}/{MAX_STORYPART_LENGTH}</Typography><br />
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Button variant="contained" color="primary" onClick={this.sendCreateStoryRequest}>Submit</Button>
            </Wrapper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(InitializeStory)