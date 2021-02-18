import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../../message';
import Typography from '@material-ui/core/Typography';
import buildRequest, { tryRenderRichTextFromRawJSON } from '../../../../helpers';
import axiosSetUp from '../../../../axiosConfig';
import styled from 'styled-components';
import history from '../../../../history';

class UserStoryParts extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            StoryParts: [],
            page: 1,
            count: 5
        }
    }

    Page = styled.p`
    display: inline-block;
    font-size:28px;
    margin: 30px;
    `;
    SubPage = styled.p`
    display: inline-block;
    &:hover {
        cursor: pointer
    }
    font-size:20px;
    margin: 30px;
    `;
    StoryTitle = styled.i`
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    `;


    componentDidMount() {
        this.sendGetStoryPartsOfUserPageRequest();
    }

    sendGetStoryPartsOfUserPageRequest = (page = this.state.page) => {
        const queryData = {
            userId: this.props.token.id,
            page: page,
            count: this.state.count
        }
        axiosSetUp().get(buildRequest('/storyPart/getOfUser', queryData))
            .then(response => {
                this.setState({
                    StoryParts: response.data.storyParts || [],
                    page: response.data.page
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while loading data. Try again later.',
                        type: 'error'
                    }
                })
            })
    }


    renderStoryPart = (storyPart) => {
        return <>
            <Typography variant="caption" style={{ textAlign: "right", wordBreak: "break-all" }}>
                From: <this.StoryTitle onClick={() => history.push(`story${storyPart.storyId}`)}>{storyPart.titleOfStory}</this.StoryTitle> with <b style={{fontSize: "14px"}}>{storyPart.rating}</b> votes
            </Typography><br />
            {tryRenderRichTextFromRawJSON(storyPart.body)}<hr />
        </>
    }

    renderPageSelection = () => {
        let pages = [];
        for (let i = 2; i > -3; i--) {
            pages.push(this.state.page - i)
        }
        pages = pages.filter(page => page >= 1)
        return <>
            {pages.map(page => {
                if (page === this.state.page) {
                    return <this.Page style={{ fontSize: "30px", border: "solid 1px", padding: "5px" }}>{page}</this.Page>
                }
                else {
                    return <this.SubPage onClick={() => this.sendGetStoryPartsOfUserPageRequest(page)}>{page}</this.SubPage>
                }
            })}
        </>
    }

    render() {
        return (<>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.StoryParts.map(storyPart => {
                return this.renderStoryPart(storyPart);
            })}
            {this.renderPageSelection()}
        </>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(UserStoryParts)
