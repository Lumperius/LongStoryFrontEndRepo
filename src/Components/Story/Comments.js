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
import buildQuery from '../../helpers';


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
        this.sendGetCommentsRequest();
    }

    sendPostCommentRequest = () => {
        if (!this.state.editorState || this.state.editorState.getCurrentContent().getPlainText().length > 1000 ||
            !this.state.editorState.getCurrentContent().getPlainText().length) {
            this.setState({
                message: {
                    body: 'Incorrect text',
                    type: 'error'
                }
            })
            return;
        }

        let body = {
            userId: this.props.token.id,
            storyId: this.props.storyId,
            body: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
        }
        const queryData = {
            storyId: this.props.storyId
        }
        axiosSetUp().post(buildQuery(`/comment/post`, queryData), body)
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
        let jsonIds = JSON.stringify(userIdList);
        const queryData = {
            userIdList: jsonIds
        }
        axiosSetUp().get(buildQuery(`/userInfo/getRange`, queryData))
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
        axiosSetUp().get(buildQuery(`/comment/get`, queryData))
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


    renderComments = () => {
        return <>
            {this.state.Comments.map(comment => {
                let userInfo = this.state.UserInfoList.find(ui => ui.userId === comment.userId) || []

                try   { EditorState.createWithContent(convertFromRaw(JSON.parse(comment.body))) }
                catch {
                    return <div style={{ backgroundColor: "white", margin: "20px",  padding: "35px", paddingTop: "0px"}}>
                        <this.CommentWrapper>{comment.body}</this.CommentWrapper>
                        <img src={`data:image/jpeg;base64,${userInfo.avatarBase64}`} alt="Not loaded"
                            style={{ float: 'right', marginTop: "0px", marginLeft: "10px" }} width="30px" aling="bottom" vspace="10px" />
                        <Typography variant="subtitle1" style={{ float: "right", wordBreak: "break-all" }}>
                            {userInfo.userLogin || undefined} at {comment.datePosted || undefined}
                        </Typography>
                    </div>
                }

                return <div style={{ backgroundColor: "white", margin: "20px", padding: "35px", paddingTop: "0px" }}>
                    <Editor
                        toolbarHidden={true}
                        editorState={EditorState?.createWithContent(convertFromRaw(JSON.parse(comment.body) || null)) || null}
                    />
                    <span style={{ marginTop: "-20px" }}>
                        <img src={`data:image/jpeg;base64,${userInfo.avatarBase64}`} style={{ float: 'right', marginTop: "0px", marginLeft: "10px" }}
                        width="30px" aling="bottom" vspace="10px"  alt="Not loaded"/>
                        <Typography variant="subtitle1" style={{ float: "right", wordBreak: "break-all" }}>
                            {userInfo.userLogin || undefined} at {comment.datePosted || undefined}
                        </Typography>
                    </span>
                </div>
            })}
        </>
    }


    render() {
        return (<Wrapper>
            <Typography variant="h4">Commentaries</Typography>
            <a href="#addComment"><Typography variant="caption" id="Comments">Add a comment</Typography></a>
            {this.renderComments()}
            <this.EditorWraper><Editor 
            name="body"
            onEditorStateChange={this.onEditorStateChange}
            style={{ backgroundColor: "white" }}
            toolbar={{
                option: ['inline','link','list']
            }} />
            </this.EditorWraper>
            <Typography variant="subtitle2" id="addComment">{this.state.editorState.getCurrentContent().getPlainText().length}/1000</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button color="primary" variant="contained" onClick={this.sendPostCommentRequest}>submit</Button><br />
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Comments)
