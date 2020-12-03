import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';

class CandidatesScroller extends React.Component {
    constructor() {
        super();
        this.state = {
            message: '',
            CandidatesList: []
        }
    }

    NextCandidate = styled.div`
    
    `;
    PreviousCandidate = styled.div`
    
    `;
    CandidateBlock = styled.div`
    width: 100%;
    background-color: lightgray;
    display: block;
    margin: 0px;
    &:hover {
        background-color: grey;
    }`;

    Scroller = styled.div`
    width: 100%;
    height: 500px;
    white-space:nowrap; 
    overflow-y: scroll;
    `;
    InfoMessage = styled.p` 
    color: black;
    font-size: 18px;
    `;
    Signature = styled.p`
    font-size: 14px;
    text-align: right;
    `;



    componentDidMount() {
        this.sendGetCandidatesRequest();
    }


    sendGetCandidatesRequest = () => {
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/storyPartCandidate/getAll?storyId=${this.props.storyId}&userId=${userId}`)
            .then(response => {
                this.setState({
                    CandidatesList: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })

    }

    sendVoteCandidateRequsest = (storyPartId, candidate) => {
        if (candidate.isRated) return this.setState({message: 'You can not vote twice on same candidate'});
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/storyPartCandidate/vote?storyPartId=${storyPartId}&userId=${userId}`)
            .then(response => {
                this.setState({
                    message: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
        candidate.isRated = true;
        candidate.rating = ++candidate.rating;

    }


    renderCandidate = (candidate) => {
        let voteMessage;
        if (candidate.isRated) voteMessage = 'Already rated'
        else voteMessage = 'Click to rate'
        return <this.CandidateBlock onClick={() => {
            this.sendVoteCandidateRequsest(candidate.id, candidate);
        }}>
            {candidate.body} <this.Signature><b>{candidate.rating} {voteMessage}</b> {candidate.author} {candidate.dateSubmitted}</this.Signature>
        </this.CandidateBlock>
    }


    render() {
        return <this.Scroller>
            <this.InfoMessage>{this.state.message}</this.InfoMessage>
            {this.state.CandidatesList.map((candidate) => {
                return <>
                    {this.renderCandidate(candidate)}
                </>
            })}
        </this.Scroller>
    }

}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(CandidatesScroller)