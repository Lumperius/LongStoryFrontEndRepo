import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import buildRequest, {tryRenderRichTextFromRawJSON} from '../../helpers';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";


class CandidatesScroller extends React.Component {
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            CandidatesList: []
        }
    }

    CandidateBlock = styled.div`
    width: 100%;
    background-color: lightgray;
    display: block;
    margin: 0px;
    wordWrap: break-word;
    textIndent: "15px";
    &:hover {
        background-color: grey;
    }`;

    Scroller = styled.div`
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 900px;
    `;
    InfoMessage = styled.p` 
    color: black;
    font-size: 18px;
    `;
    Signature = styled.p`
    font-size: 14px;
    text-align: right;
    word-break: break-all
    `;


    componentDidMount() {
        this.sendGetCandidatesRequest();
    }

    sendGetCandidatesRequest = () => {
        const queryData = {
            storyId: this.props.storyId,
            userId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/storyPart/getAllCandidates', queryData))
            .then(response => {
                if (typeof response.data === 'string') throw response
                this.setState({
                    CandidatesList: response.data || []
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    message: {
                        body: 'Error occured while downloading entries',
                        type: 'error'
                    }
                })
            })

    }

    sendVoteCandidateRequsest = (candidate) => {
        if (candidate.isRated) return this.setState({
            message: {
                body: 'You can not vote twice on same candidate',
                type: 'error'
            }
        });
        const body = {
            storyPartCandidateId: candidate.id,
            userId: this.props.token.id
        }
        axiosSetUp().post(buildRequest('/storyPart/vote'), body)
            .then(response => {
                this.setState({
                    message: {
                        body: response.data,
                        type: 'info'
                    }
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    message: {
                        body: 'Error occured while sending the vote',
                        type: 'error'
                    }
                })

            })
        candidate.isRated = true;
        candidate.rating++;

    }

    renderCandidate = (candidate) => {
        let voteMessage;
        if (candidate.isRated) voteMessage = 'Already rated'
        else voteMessage = 'Click to vote'
        try { EditorState.createWithContent(convertFromRaw(JSON.parse(candidate.body))) }
        catch {
            return <this.CandidateBlock onClick={() => {
                this.sendVoteCandidateRequsest(candidate);
            }}>
                <Typography variant="body" style={{ wordBreak: "break-all", textIndent: "15px" }}>
                    {tryRenderRichTextFromRawJSON(candidate.body)}
                </Typography>
                <this.Signature><b>{candidate.rating} {voteMessage}</b> {candidate.author} {candidate.dateSubmitted}</this.Signature>
            </this.CandidateBlock>
        }
        return <this.CandidateBlock onClick={() => {
            this.sendVoteCandidateRequsest(candidate);
        }}>
            <Editor
                toolbarHidden={true}
                editorState={EditorState?.createWithContent(convertFromRaw(JSON.parse(candidate.body) || null)) || null}
            />
            <hr />
            <this.Signature><b>{candidate.rating} {voteMessage}</b> {candidate.author} {candidate.dateSubmitted}</this.Signature>
        </this.CandidateBlock>
    }



    render() {
        return <this.Scroller>
            {this.state.CandidatesList.map((candidate) => {
                return <>
                    {this.renderCandidate(candidate)}
                </>
            })}
            {renderMessage(this.state.message.body, this.state.message.type)}
        </this.Scroller>
    }

}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(CandidatesScroller)