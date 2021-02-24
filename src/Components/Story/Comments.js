import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Wrapper from '../../objects';
import buildRequest from '../../helpers';
import { stateToHTML } from 'draft-js-export-html';
import toolbar from '../../toolBarConfig';


const MAX_COMMENT_BODY_LENGTH = 1000;

class Comments extends React.Component {
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: '',
            },
            Comments: [],
            UserInfoList: [],
            editorState: EditorState.createEmpty()
        }
    }
    commentToolbar = {
        options: [...toolbar.options]
    };
    

    CommentWrapper = styled.div`
    margin: 10px;
    padding: 20px;
    padding-bottom: 40px;
    word-break: break-all;
    `;
    EditorWraper = styled.div`
    background-color: white;
    `;


    componentDidMount() {
        this.commentToolbar.options.push('emoji')
        this.sendGetCommentsRequest();
    }

    isCommentValid = () => {
        if (!this.state.editorState || this.state.editorState.getCurrentContent().getPlainText().length > MAX_COMMENT_BODY_LENGTH
            || this.state.editorState.getCurrentContent().getPlainText().length < 1) {
            this.setState({
                message: {
                    body: 'Incorrect text',
                    type: 'error'
                }
            })
            return false;
        }

        const imgRegex = new RegExp('<img.+?>')
        const htmlText = stateToHTML(this.state.editorState.getCurrentContent())
        if (imgRegex.test(htmlText)) {
            this.setState({
                message: {
                    body: 'Images are not allowed.',
                    type: 'error'
                }
            })
            return false;
        }
        return true;
    }

    sendPostCommentRequest = () => {
        if (!this.isCommentValid())
            return;
        const body = {
            userId: this.props.token.id,
            storyId: this.props.storyId,
            body: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
        }
        axiosSetUp().post(buildRequest('/comment/post'), body)
            .then(response => {
                this.setState({
                    message: {
                        body: response.data,
                        type: 'success'
                    }
                })
                this.sendGetCommentsRequest();
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while sending the comment',
                        type: 'error'
                    }
                })
            })

    }

    sendGetUserInfoRequest = () => {
        let userIdList = [];
        this.state.Comments.forEach(comment => {
            if (!userIdList.find(id => id === comment.userId))
                userIdList.push(comment.userId);
        })
        const jsonIds = JSON.stringify(userIdList);
        const queryData = {
            userIdList: jsonIds
        }
        axiosSetUp().get(buildRequest('/userInfo/getRange', queryData))
            .then(response => {
                this.setState({
                    UserInfoList: response.data.userInfoList || []
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: 'Error occured while downloading entries',
                        type: 'error'
                    }
                })
            })
    }

    sendGetCommentsRequest = () => {
        const queryData = {
            storyId: this.props.storyId
        }
        axiosSetUp().get(buildRequest('/comment/get', queryData))
            .then(response => {
                this.setState({
                    Comments: response.data || []
                })
                this.sendGetUserInfoRequest();
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading entries',
                        type: 'error'
                    }
                })
            })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }

    handleBeforeInput = () => {
        if (this.state.editorState.getCurrentContent().getPlainText().length >= MAX_COMMENT_BODY_LENGTH)
            return 'handled'
    }

    handlePastedText = (pastedText) => {
        if (this.state.editorState.getCurrentContent().getPlainText().length + pastedText.length > MAX_COMMENT_BODY_LENGTH)
            return 'handled'
    }


    renderComments = () => {
        if (this.state.Comments.length > 0)
            return <>
                <Typography variant="h4">Commentaries</Typography>
                {this.state.Comments.map(comment => {
                    const userInfo = this.state.UserInfoList.find(ui => ui.userId === comment.userId) || []

                    try { EditorState.createWithContent(convertFromRaw(JSON.parse(comment.body))) }
                    catch {
                        return <>
                            <this.CommentWrapper>{comment.body}</this.CommentWrapper>
                            <img src={`data:image/jpeg;base64,${userInfo.avatarBase64}`} alt="Not loaded"
                                style={{ float: "right", marginTop: "0px", marginLeft: "10px" }} width="30px" aling="bottom" vspace="10px" />
                            <Typography variant="subtitle1" style={{ float: "right", wordBreak: "break-all" }}>
                                {userInfo.userLogin || undefined} at {comment.datePosted || undefined}
                            </Typography><hr/>
                        </>
                    }

                    return <div style={{ backgroundColor: "white", margin: "20px", padding: "35px", paddingTop: "0px" }}>
                        <Editor
                            toolbarHidden={true}
                            editorState={EditorState?.createWithContent(convertFromRaw(JSON.parse(comment.body) || null)) || null}
                        />
                        <span style={{ marginTop: "-20px" }}>
                            <img src={`data:image/jpeg;base64,${userInfo.avatarBase64}`} style={{ float: "right", marginTop: "0px", marginLeft: "10px" }}
                                width="30px" aling="bottom" vspace="10px" alt="Not loaded" />
                            <Typography variant="subtitle1" style={{ float: "right", wordBreak: "break-all" }}>
                                {userInfo.userLogin || undefined} at {comment.datePosted || undefined}
                            </Typography>
                        </span>
                    </div>
                })}
            </>
        else return <Typography variant="h5">No comments yet</Typography>
    }

    renderEditor = () => {
        if (this.props.token)
            return <>
                <a href="#addComment"><Typography variant="caption" id="Comments">Add a comment</Typography></a>
                <this.EditorWraper><Editor
                    name="body"
                    toolbar={this.commentToolbar}
                    handleBeforeInput={this.handleBeforeInput}
                    handlePastedText={this.handlePastedText}
                    onEditorStateChange={this.onEditorStateChange}
                    style={{ backgroundColor: "white" }}/>
                </this.EditorWraper>
                <Typography variant="subtitle2" id="addComment">{this.state.editorState.getCurrentContent().getPlainText().length}/{MAX_COMMENT_BODY_LENGTH}</Typography>
                <Button color="primary" variant="contained" onClick={this.sendPostCommentRequest}>submit</Button><br />
            </>
    }

    render() {
        return (<Wrapper style={{backgroundColor: "GhostWhite"}}>
            {this.renderComments()}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderEditor()}
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Comments)
