import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import AddStoryPart from './AddStoryPart';
import CandidatesScroller from './CandidatesScroller'
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

class Story extends React.Component {

    constructor() {
        super();
        this.state = {
            story: {
                id: '',
                title: '',
                firstElementBody: '',
                dateSubmitted: null,
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

    Wraper = styled.div`
    text-align:left;
    margin: 90px;
    font-size: 28px;
    `;
    SuggestNextPartButton = styled.button`
    
    `;
    Signature = styled.p`
    font-size: 14px;
    text-align: right;
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
    `;


    componentDidMount() {
        this.sendGetStoryRequest();
    }


    sendGetStoryRequest() {
        let storyId = this.props.match.params.id;
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/story/get?storyId=${storyId}&userId=${userId}`)
            .then(response => {
                this.setState({
                    story: {
                        id: response.data.id,
                        title: response.data.title,
                        firstElementBody: response.data.firstElementBody,
                        dateSubmitted: response.data.dateSubmitted,
                        author: response.data.author,
                        rating: response.data.rating,
                        isFinishedMessage: response.data.isFinished ? 'finished' : 'In process',
                        isVoted: response.data.isVoted,
                    },
                    StoryParts: response.data.storyParts || [],
                    StoryPartCandidates: response.data.storyPartCandidates || []
                })
            })
    }

    sendVoteRequest = (storyId, voteType) => {
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
                if(voteType)    prevState.story.rating++;
                else prevState.story.rating--;
                let state = this.state;
                state.story.isVoted = true;
                this.setState({state});
                })
            .catch((ex) => {
                console.log('Failed', ex)
            })
    };


    renderEditor = () => {
        if (this.props.token) {
            if (this.state.story.isFinishedMessage === 'In process') {
                if (this.state.showEditor) {
                    let storyId = this.props.match.params.id;
                    return <AddStoryPart storyId={storyId} />
                }
                else return <>
                    <Button variant="contained" color="primary" onClick={
                        () => this.setState({ showEditor: true })}>
                        Suggest next story part
                </Button>

                    <CandidatesScroller storyId={this.state.story.id} /><br />
                </>
            }
            else {
                return <Typography>This story is finished</Typography>
            }
        }
        else {
            return <Typography>Authorize and you will be able to participate in writing this story</Typography>
        }
    }

    renderStoryPart = (storyPart) => {
        if (storyPart.body) {
            return <>
                <p>{storyPart.body}</p>
                <this.Signature>{storyPart.author} {storyPart.dateSubmitted}</this.Signature>
                <hr />
            </>
        }
    }

    renderVoteButtons = () => {
        if(this.state.story.isVoted === true) {
            return <Typography variant="subtitle1">You voted this story</Typography>
        }
        else{
            return   <div>
            <Button variant="contained" style={{ backgroundColor: "LimeGreen", margin: "10px"}} onClick={() => this.sendVoteRequest(this.state.story.id, true)}>Vote up</Button>
            <Button variant="contained" style={{ backgroundColor: "FireBrick"   }} onClick={() => this.sendVoteRequest(this.state.story.id, false)}>Vote down</Button>
        </div>
        }
    }


    render() {
        return <this.Wraper>
            <h1>{this.state.story.title}</h1>
            <p>{this.state.story.firstElementBody}</p>
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
            {this.renderEditor()}
        </this.Wraper>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Story)