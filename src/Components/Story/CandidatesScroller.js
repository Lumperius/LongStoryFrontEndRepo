import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';

class CandidatesScroller extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
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
    `;
    Scroller = styled.div`
    width: 100%;
    height: 500px;
    white-space:nowrap; 
    overflow-y: scroll;
    `;
    ErrorMessage = styled.p` 
    color: red;
    font-size: 14px;
    `;


    sendVoteRequest = (candidate) => {
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/storycandidate/voteup?id=${candidate.id}&userId=${userId}`)
        .then(response => {
            this.setState({
                message: response.data
            })
        })
        .catch(error => {
            console.log(error.response.data),
            this.setState({
                message: 'something went wrong, try again later'
            })
        })
    }

    renderCandidate = (candidate) => {
        return <this.CandidateBlock onClick={() => {console.log('click')}}>{candidate.body}</this.CandidateBlock>
    }

    render() {
        return <this.Scroller>
            <globalThis.ErrorMessage>{this.state.message}</globalThis.ErrorMessage>
            {this.props.Candidates.map((candidate) => {
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