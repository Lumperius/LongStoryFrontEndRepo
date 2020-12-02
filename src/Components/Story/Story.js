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
                title: '',
                firstElementBody: '',
                isFinishedMessage: true,
                dateSubmitted: null,
                author: ''
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

    componentDidMount() {
        this.sendGetStoryRequest();
    }

    modifyDate = (ISOdate) => {
        if (ISOdate) {
            let stringDate = ISOdate.toString();
            stringDate = stringDate.replace('T', ' ');
            stringDate = stringDate.replace('-', '.');
            stringDate = stringDate.replace('-', '.');
            stringDate = stringDate.substring(0, stringDate.length - 4);
            return stringDate;
        }
    }

    sendGetStoryRequest() {
        let id = this.props.match.params.id;
        axiosSetUp().get(`http://localhost:5002/story/get?id=${id}`)
            .then(response => {
                this.setState({
                    story: {
                        title: response.data.title,
                        firstElementBody: response.data.firstElementBody,
                        dateSubmitted: response.data.dateSubmitted,
                        author: response.data.author,
                        isFinishedMessage: response.data.isFinished ? 'finished' : 'In process'
                    },
                    StoryParts: response.data.storyParts,
                    StoryPartCandidates: response.data.storyPartCandidates
                })
            })
    }

    renderEditor = () => {
        if (this.props.token) {
            if (this.state.story.isFinishedMessage === 'In process') {
                if (this.state.showEditor) {
                    let storyId = this.props.match.params.id;
                    return <AddStoryPart storyId={storyId} />
                }
                else return <>
                <CandidatesScroller Candidates={this.state.StoryPartCandidates} /><br/>
                <this.SuggestNextPartButton onClick={
                    () => this.setState({ showEditor: true })}>
                    Suggest next story part
                </this.SuggestNextPartButton>
                </>
            }
            else{
                return <>This story is finished</>
            }
        }
        else {
            return <>Authorize and you will be able to participate in creating of this story</>
        }
    }

    renderStoryPart = (storyPart) => {
        if (storyPart.body) {
            return <>
                <p>{storyPart.body}</p>
                <this.Signature>{storyPart.author} {this.modifyDate(storyPart.dateSubmitted)}</this.Signature>
                <hr />
            </>
        }
    }


    render() {
        return <this.Wraper>
            <h1>{this.state.story.title}</h1>
            <p>{this.state.story.firstElementBody}</p>
            <this.Signature>
                {this.state.story.author}
                {this.modifyDate(this.state.story.dateSubmitted)}
                _{this.state.story.isFinishedMessage}
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