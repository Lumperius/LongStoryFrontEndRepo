import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import AddStoryPart from './AddStoryPart';
import CandidatesScroller from './CandidatesScroller'
import { connect } from 'react-redux';


class Story extends React.Component {

    constructor() {
        super();
        this.state = {
            story: {
                id: '',
                title: '',
                firstElementBody: '',
                isFinishedMessage: true,
                dateSubmitted: null,
                author: '',
                rating: 0
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
        let id = this.props.match.params.id;
        axiosSetUp().get(`http://localhost:5002/story/get?id=${id}&`)
            .then(response => {
                this.setState({
                    story: {
                        id: response.data.id,
                        title: response.data.title,
                        firstElementBody: response.data.firstElementBody,
                        dateSubmitted: response.data.dateSubmitted,
                        author: response.data.author,
                        isFinishedMessage: response.data.isFinished ? 'finished' : 'In process',
                        rating: response.data.rating
                    },
                    StoryParts: response.data.storyParts,
                    StoryPartCandidates: response.data.storyPartCandidates
                })
            })
    }

    sendUpvoteRequest = (storyId) => {
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/story/vote?storyId=${storyId}&userId=${userId}`)
            .then((response) => {
                let prevState = this.state;
                prevState.message = response.data;
                prevState.story.rating++;
                this.setState(prevState)
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
                <CandidatesScroller storyId={this.state.story.id} /><br />
                <this.SuggestNextPartButton onClick={
                    () => this.setState({ showEditor: true })}>
                    Suggest next story part
                </this.SuggestNextPartButton>
            </>
        }
        else {
            return <>This story is finished</>
        }
    }
    else {
        return <>Authorize and you will be able to participate in writing of this story</>
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


render() {
    return <this.Wraper>
        <h1>{this.state.story.title}</h1>
        <p>{this.state.story.firstElementBody}</p>
        <this.Signature>
            <this.Rating>{this.state.story.rating}</this.Rating>
            {this.state.story.author}_
                {this.state.story.dateSubmitted}
                _{this.state.story.isFinishedMessage}
            <div>
                <this.Vote style={{ backgroundColor: "green" }} onClick={() => this.sendUpvoteRequest(this.state.story.id)}></this.Vote >
                <this.Vote style={{ backgroundColor: "red" }} onClick={() => this.sendUpvoteRequest(this.state.story.id)}></this.Vote>
            </div>
        </this.Signature>
        <hr /><hr />
        {this.state.StoryParts.map((storyPart) => {
            return <>{this.renderStoryPart(storyPart)}</>
        })}
        <br />{this.renderEditor()}
    </this.Wraper>
}
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Story)