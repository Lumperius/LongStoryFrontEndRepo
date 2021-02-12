import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../../message';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import buildQuery, { tryRenderRichTextFromRawJSON } from '../../../../helpers';
import axiosSetUp from '../../../../axiosConfig';
import styled from 'styled-components';


class FavoriteStories extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            FavoriteStoryIds: [],
            FavoriteStoryList: [],
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


    componentDidMount() {
        this.sendGetFavoriteStoriesIdsRequest();
    }

    sendGetFavoriteStoriesIdsRequest = () => {
        const queryData = {
            userId: this.props.token.id,
            page: 1,
            count: 10
        }
        axiosSetUp().get(buildQuery('/userFavoriteStory/get', queryData))
            .then(response => {
                 this.setState({
                    FavoriteStoryIds: response.data.favoriteStories
                 })
                this.sendGetFavoriteStories();
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Failed to load favorite stories.',
                        type: 'error'
                    }
                })
            })
    }


    sendGetFavoriteStories = (page = this.state.page) => {
        const queryData = {
            favoriteStoryIdListJSON: JSON.stringify(this.state.FavoriteStoryIds),
            page: page,
            count: this.state.count
        }

        axiosSetUp().get(buildQuery('/story/getFavoritePage', queryData))
            .then(response => {
                this.setState({
                    FavoriteStoryList: response.data.favoriteStories || [],
                    page: response.data.page
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Failed to load favorite stories',
                        type: 'error'
                    }
                })
            })
    }


    sendRemoveFromFavoritesRequest = (storyId) => {
        const queryData = {
            userId: this.props.token.id,
            storyId: storyId
        }
        axiosSetUp().delete(buildQuery('/userFavoriteStory/delete', queryData))
            .then(response => {
                let state = this.state;
                state.message = {
                    body: 'Removed successfully.',
                    type: 'success'
                };
                state.FavoriteStoryList
                    .splice(state.FavoriteStoryList
                        .indexOf(state.FavoriteStoryList
                            .find(s => s.storyId === storyId)), 1)

                this.setState(state)
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'A mistake occured while removing favorite story. Try again later.',
                        type: 'error'
                    }
                })
            })
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
                    return <this.SubPage onClick={() => this.sendGetFavoriteStories(page)}>{page}</this.SubPage>
                }
            })}
        </>
    }

    renderFavoriteStory = (story) => {
        return <>
            <Button variant="outlined" style={{ float: "right", marginLeft: "5px" }} onClick={() => this.sendRemoveFromFavoritesRequest(story.storyId)}>Remove</Button>
            <Button variant="contained" color="primary" style={{ float: "right" }} onClick={() => window.open(`../story${story.storyId}`, "_blank")}>Inspect</Button>
            <Typography variant="h5">{story.title}</Typography><br />
            <Typography variant="body1" style={{ textIndent: "15px", wordBreak: "break-all" }}>{tryRenderRichTextFromRawJSON(story.body)}</Typography><br />
            <Typography variant="subtitle1">{story.dateSubmitted}</Typography><hr />
        </>
    }


    render() {
        return (<>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.FavoriteStoryList.map(story => {
                return this.renderFavoriteStory(story)
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

export default connect(mapStateToProps)(FavoriteStories)
