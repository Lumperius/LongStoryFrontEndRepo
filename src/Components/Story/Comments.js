import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import axiosSetUp from '../../axiosConfig';


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
            commentBody: ''
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin: 30px;
    padding: 20px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: lightgrey;
    background-color: lightgrey;
    `;
    CommentWrapper = styled.div`
    margin: 10px;
    padding: 20px;
    padding-bottom: 40px;
    background-color: WhiteSmoke;
    `;


    componentDidMount() {
        this.sendGetCommentsRequest();
    }

    sendPostCommentRequest = () => {
        if (this.state.commentBody.length > 1000 || !this.state.commentBody.length) {
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
            body: this.state.commentBody
        }
        axiosSetUp().post(`http://localhost:5002/comment/post?storyId=${this.props.storyId}`, body)
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
                        body: error.data,
                        type: 'error'
                    }
                })
            })

    }

    sendGetUserInfoRequest = () => {
        let userIdList = [];
        this.state.Comments.forEach(comment => {
            if (!userIdList.find(id => id == comment.userId))
                userIdList.push(comment.userId);
        })
        let jsonIds = JSON.stringify(userIdList);
        axiosSetUp().get(`http://localhost:5002/userInfo/getRange?userIdList=${jsonIds}`)
            .then(response => {
                this.setState({
                    UserInfoList: response.data.userInfoList || []
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: error.data || '',
                        type: 'error'
                    }
                })
            })
    }

    sendGetCommentsRequest = () => {
        axiosSetUp().get(`http://localhost:5002/comment/get?storyId=${this.props.storyId}`)
            .then(response => {
                this.setState({
                    Comments: response.data || []
                })
                this.sendGetUserInfoRequest();
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: error.data,
                        type: 'error'
                    }
                })
            })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    renderComments = () => {
        return <>
            {this.state.Comments.map(comment => {
                let userInfo = this.state.UserInfoList.find(ui => ui.userId == comment.userId) || []
                return <>
                    <this.CommentWrapper>
                        <Typography variant="subtitle1" style={{ wordWrap: "break-word", padding: "10px" }}>{comment.body}</Typography><br />
                        <img src={`data:image/jpeg;base64,${userInfo.avatarBase64}`}
                            style={{ float: 'right', marginTop: "0px", marginLeft: "10px" }} width="30px" aling="bottom" vspace="10px" />
                        <Typography variant="subtitle1" style={{ float: 'right' }}>
                            {userInfo.userLogin || 'Undefined'} at {comment.datePosted}
                        </Typography>
                    </this.CommentWrapper>
                </>
            })}
        </>
    }


    render() {
        return (<this.Wraper>
            <Typography variant="h4">Commentaries</Typography>
            <a href="#addComment"><Typography variant="caption" id="Comments">Add a comment</Typography></a>
            {this.renderComments()}
            <TextareaAutosize maxLength="1000" name="commentBody" placeholder="Add your comment(1000 symbols max)"
                style={{ fontSize: "20px", width: "96%", height: "15vh", marginTop: "50px" }} onChange={this.handleChange}></TextareaAutosize>
            <Typography variant="subtitle2" id="addComment">{this.state.commentBody.length}/1000</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button color="primary" variant="contained" onClick={this.sendPostCommentRequest}>submit</Button><br />
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Comments)
