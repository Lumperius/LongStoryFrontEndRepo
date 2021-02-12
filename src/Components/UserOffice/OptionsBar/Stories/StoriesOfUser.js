import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../../message';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import buildQuery, { tryRenderRichTextFromRawJSON } from '../../../../helpers';
import axiosSetUp from '../../../../axiosConfig';
import styled from 'styled-components';

class StoriesOfUser extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            Stories: [],
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
        this.sendGetStoriesOfUserRequest();
        }

    sendGetStoriesOfUserRequest = () => {
        const queryData = {
            userId: this.props.token.id,
            page: this.state.page,
            count: this.state.count
        }
        axiosSetUp().get(buildQuery('/story/getOfUserPage', queryData))
        .then(response => {
            this.setState({
                Stories: response.data.stories || [],
                page: response.data.page
            })
        })
        .catch(error => {
            this.setState({
                message: {
                    body: 'Error occured while loading stories.',
                    type: 'error'
                }
            })
        })
    }


    renderStory = (story) => {
        return <>
            <Button variant="contained" color="primary" style={{ float: "right" }} onClick={() => window.open(`../story${story.id}`, "_blank")}>Inspect</Button>
            <Typography variant="h5">{story.title}</Typography><br />
            <Typography variant="body1" style={{ textIndent: "15px", wordBreak: "break-all" }}>{tryRenderRichTextFromRawJSON(story.body)}</Typography><br />
            <Typography variant="subtitle1">{story.dateSubmitted}</Typography><hr />
        </>
    };

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


    render() {
        return (<>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.Stories.map(story => {
                return this.renderStory(story);
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

export default connect(mapStateToProps)(StoriesOfUser)
