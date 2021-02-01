import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Wrapper from '../../objects';

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

    validateRequestParametrs = () => {
        if (!this.state.title || this.state.title.length < 1 || this.state.title.length > 50) {
            this.setState({
                message: {
                    body: 'Incorrect title. It must more than 1 and less than 50 symbols.',
                    type: 'error'
                }
            });
            return false;
        }

        if (!this.state.editorState?.getCurrentContent() || this.state.editorState?.getCurrentContent().getPlainText().length < 20 ||
            this.state.editorState?.getCurrentContent().getPlainText().length >= 4000) {
            this.setState({
                message: {
                    body: 'Incorrect text. It must more than 20 and less than 4000 symbols.',
                    type: 'error'
                }
            });
            return false;
        }
        return true;
    }

    sendCreateStoryRequest = () => {
        if (!this.validateRequestParametrs()) return;
        let body = {
            userId: this.props.token.id,
            title: this.state.title,
            body: stateToHTML(this.state.editorState.getCurrentContent()),
            author: this.props.token.login,
            authorId: this.props.token.id,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post("http://localhost:5002/story/createStory", body)
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
                debugger
                console.log(error)
                this.setState({
                    message: {
                        body: 'Error occured while creating the story',
                        type: 'error'
                    },
                })
            })
    }

    render() {
        return (
            <Wrapper>
                <this.TitleInput name="title" maxLength="50" placeholder="Enter a title" onChange={this.handleChange}></this.TitleInput><br />
                <Typography variant="subtitle2">{this.state.title.length}/50</Typography><br />
                <Editor name="body" placeholder="Type the beginning of story here" onEditorStateChange={this.onEditorStateChange} />
                <Typography variant="subtitle2">{this.state.editorState.getCurrentContent().getPlainText().length}/4000</Typography><br />
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