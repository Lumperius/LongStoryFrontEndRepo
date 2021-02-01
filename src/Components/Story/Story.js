import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import AddStoryPart from './AddStoryPart';
import CandidatesScroller from './CandidatesScroller'
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import Comments from './Comments';
import ReactHtmlParser from 'react-html-parser';
import Wrapper from '../../objects';


class Story extends React.Component {

    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            story: {
                id: '',
                authorId: '',
                title: '',
                firstElementBody: '',
                dateSubmitted: '',
                author: '',
                rating: 0,
                isFinishedMessage: true,
                isVoted: true,
            },
            showEditor: false,
            StoryParts: [],
            StoryPartCandidates: []
        }
    }

    Signature = styled.p`
    font-size: 14px;
    text-align: right;
    dipaly: inline;
    word-break: break-all
    `;
    Vote = styled.button`
    display: inline-block; 
    border: none;
    align-right :true;
    border-radius: 100px;
    float: right;
    padding: 10px;
    margin: 2px;
    padding: 15px;
    &:hover {
        padding: 16px;
    }
    `;
    Rating = styled.p`
    margin: 10px;
    padding: 0;
    font-size: 40px;
    color: darkred;
    word-break: break-all
    `;


    componentDidMount() {
        this.sendGetStoryRequest();
    }

    sendGetStoryPartsRequest = () => {
        let storyId = this.props.match.params.id;
        axiosSetUp().get(`http://localhost:5002/storyPart/getAllParts?storyId=${storyId}`)
            .then(response => {
                this.setState({
                    StoryParts: response.data || []
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading the story',
                        type: 'error'
                    }
                })
            })
    }

    sendGetStoryRequest() {
        let storyId = this.props.match.params.id;
        let requestUrl = `http://localhost:5002/story/get?storyId=${storyId}`;

        if (this.props.token)
            requestUrl = `${requestUrl}&userId=${this.props.token.id}`;

        axiosSetUp().get(requestUrl)
            .then(response => {
                this.setState({
                    story: {
                        id: response.data.id,
                        authorId: response.data.authorId,
                        title: response.data.title,
                        dateSubmitted: response.data.dateSubmitted,
                        author: response.data.author,
                        rating: response.data.rating,
                        state: response.data.state,
                        isVoted: response.data.isVoted,
                    },
                })
                this.sendGetStoryPartsRequest();
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    message: {
                        body: 'Error occured while downloading the story',
                        type: 'error'
                    }
                })
            })
    }

    sendVoteRequest = (voteType) => {
        let storyId = this.props.match.params.id;
        let userId = this.props.token.id;
        let body = {
            storyId: storyId,
            userId: userId,
            isPositive: voteType
        }
        axiosSetUp().post(`http://localhost:5002/story/vote`, body)
            .then((response) => {
                let prevState = this.state;
                prevState.message = response.data;
                if (voteType) prevState.story.rating++;
                else prevState.story.rating--;
                let state = this.state;
                state.story.isVoted = true;
                this.setState({ state });
            })
            .catch((ex) => {
                console.log('Failed', ex);
                this.setState({
                    message: {
                        body: 'Error occured while sending the vote',
                        type: 'error'
                    }
                })
            })
    };

    sendFinishStoryRequest = () => {
        let storyId = this.props.match.params.id;
        let body = {
            storyId: storyId,
            userId: this.props.token.id
        }
        axiosSetUp().post(`http://localhost:5002/story/finish`, body)
            .then(response => {
                this.setState({
                    message: {
                        body: response.data,
                        type: 'info'
                    }
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Unable to finish the story. Try again later or contact the administrator.',
                        type: 'error'
                    }
                })
            });
    };


    handleStopRenderingEditor = () => {
        this.setState({
            showEditor: false
        })
    }

    renderEditor = () => {
        if (this.props.token) {
            switch (this.state.story.state) {
                case 'Alive':
                    if (this.state.showEditor) {
                        let storyId = this.props.match.params.id;
                        return <AddStoryPart storyId={storyId} stopRenderEditor={this.handleStopRenderingEditor} />
                    }
                    else return <>
                        <Button variant="contained" color="primary" style={{ padding: "20px" }}
                            onClick={() => this.setState({ showEditor: true })}>
                            Suggest next story part
                        </Button>

                        <CandidatesScroller storyId={this.state.story.id} /><br />
                    </>
                case 'Finished':
                    return <Typography>This story is finished</Typography>
                case 'Rated':
                    return <>
                        <Typography>This story is being rated right now, you need to wait a little before you can submit new parts</Typography>
                        <CandidatesScroller storyId={this.state.story.id} /><br />
                    </>
                default: <></>
            }
        }
        else {
            return <Typography>Authorize and you will be able to participate in writing this story</Typography>
        }
    }

    renderStoryPart = (storyPart) => {
        if (storyPart.body) {
            return <>
                <Typography variant="body" style={{ wordBreak: "break-all", textIndent: "15px" }}>{ReactHtmlParser(storyPart.body)}</Typography>
                <this.Signature>{storyPart.author} at {storyPart.dateAdded} with {storyPart.rating} votes</this.Signature>
                <hr />
            </>
        }
    }

    renderVoteButtons = () => {
        if (this.state.story.isVoted === true) {
            return <Typography variant="subtitle1">You voted this story</Typography>
        }
        if (!this.props.token)
            return <Typography variant="subtitle1">Sign in to be able to vote stories</Typography>
        else {
            return <div>
                <Button variant="contained" style={{ backgroundColor: "LimeGreen", margin: "10px" }} onClick={() => this.sendVoteRequest(true)}>Vote up</Button>
                <Button variant="contained" style={{ backgroundColor: "FireBrick" }} onClick={() => this.sendVoteRequest(false)}>Vote down</Button>
            </div>
        }
    }

    renderFinishStoryButton = () => {
        if (this.props.token)
            if (this.props.token.id === this.state.story.authorId && this.state.story.state !== 'Finished')
                return <>
                    <Button variant="outlined" onClick={this.sendFinishStoryRequest} style={{ color: "red" }}>Finish this story</Button>
                </>
    }


    render() {
        return <Wrapper>
            <Typography variant="h3" style={{wordBreak: "break-all"}}>{this.state.story.title}</Typography>
            <this.Signature>
                <this.Rating>{this.state.story.rating}</this.Rating>
                {this.state.story.author}_
                {this.state.story.dateSubmitted}
                _{this.state.story.isFinishedMessage}
                {this.renderVoteButtons()}
            </this.Signature>
            <hr /><hr />
            {this.state.StoryParts.map((storyPart) => {
                return <>{this.renderStoryPart(storyPart)}</>
            })}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderEditor()}
            <Comments storyId={this.props.match.params.id} />
            {this.renderFinishStoryButton()}<br /><br />
        </Wrapper>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Story)