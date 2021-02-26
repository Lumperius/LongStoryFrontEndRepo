import React from 'react';
import { connect } from 'react-redux';
import axiosSetUp from '../../../axiosConfig';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../../message';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import Wrapper from '../../../objects.js';
import buildRequest, { tryRenderRichTextFromRawJSON } from '../../../helpers';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { RichUtils } from 'draft-js';

const TITLE_MAX_LENGTH = 100;
const DISPLAYED_BODY_MAX_LENGTH = 100;

class BookCompose extends React.Component {
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            StoryList: [],
            MarkedStoryIdList: [],
            page: 1,
            count: 10,
            sortBy: 'date',
            secondStage: false,
            bookTitle: '',
            type: 'all',
        }
    }

    ParametersSchema = Yup.object().shape({
        bookTitle: Yup.string()
            .required('Enter title of the book')
            .max(TITLE_MAX_LENGTH, `Title can't be longer than ${TITLE_MAX_LENGTH} symbols`),
    });


    Story = styled.div`
    border-bottom: solid 1px;
    padding: 0px;
    &:hover {
        background-color: lightGrey;
    }
    `;
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
        if (!this.props.token)
            this.props.history.push('authentication');
        this.sendGetRequestAndSetNewPage();
    }

    sendComposeBookRequest = (values) => {
        if (this.state.MarkedStoryIdList.length < 1) {
            this.setState({
                message: {
                    body: 'You need to choose stories for the book first.',
                    type: 'error'
                }
            })
            return;
        }
        const body = {
            StoryIdList: this.state.MarkedStoryIdList,
            userId: this.props.token.id,
            title: values.bookTitle
        }
        axiosSetUp().post(buildRequest('/story/collectStories'), body)
            .then(response => {
                this.setState({
                    message: {
                        body: 'Your request is sent',
                        type: 'success'
                    },
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while proccessing the request. Try again later or contact the administrator.',
                        type: 'error'
                    }
                })
            })
    }


    sendGetRequestAndSetNewPage = (page = this.state.page, sortBy = this.state.sortBy) => {
        if (page < 1)
            page = 1;
        const queryData = {
            page: page,
            count: this.state.count,
            sortBy: sortBy,
            type: this.state.type
        }
        axiosSetUp().get(buildRequest('/story/getPageForSelection', queryData))
            .then((response) => {
                this.setState({
                    StoryList: response.data || [],
                    page: page,
                    message: {
                        body: '',
                        type: 'info'
                    }
                })
            })
            .catch((error) => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading stories',
                        type: 'error'
                    }
                })
            })
    };

    sendGetFavoriteStoriesIdsRequest = (page = this.state.page) => {
        const queryData = {
            userId: this.props.token.id,
            page: page,
            count: this.state.count
        }
        axiosSetUp().get(buildRequest('/userFavoriteStory/get', queryData))
            .then(response => {
                this.setState({
                    page: response.data.page,
                    message: {
                        body: '',
                        type: 'info'
                    }
                })
                this.sendGetFavoriteStories(response.data.favoriteStories);
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


    sendGetFavoriteStories = (favoriteStoriesIdList) => {
        const queryData = {
            favoriteStoryIdListJSON: JSON.stringify(favoriteStoriesIdList)
        }

        axiosSetUp().get(buildRequest('/story/getFavoritePage', queryData))
            .then(response => {
                this.setState({
                    StoryList: response.data.favoriteStories || [],
                    message: {
                        body: '',
                        type: 'info'
                    }
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




    markTheStory = (story) => {
        let markedStories = [...this.state.MarkedStoryIdList];
        if (markedStories.find(s => s === story.storyId))
            markedStories.splice(markedStories.findIndex(s => s === story.storyId), 1);
        else
            markedStories.push(story.storyId);
        this.setState({
            MarkedStoryIdList: markedStories
        })
    }

    handleNewPage = (page) => {
        switch (this.state.type) {
            case 'all':
                this.sendGetRequestAndSetNewPage(page);
                break;
            default:
                this.sendGetFavoriteStoriesIdsRequest(page);
                break;
        }
    }

    handleMenuChange = (event) => {
        this.setState({
            type: event.target.value
        })
        switch (event.target.value) {
            case 'all':
                this.sendGetRequestAndSetNewPage(undefined, event.target.value);
                break;
            default:
                this.sendGetFavoriteStoriesIdsRequest();
                break;

        }
    }

    cutBody = (body) => {
        if (body.length > DISPLAYED_BODY_MAX_LENGTH)
            return body.substring(0, DISPLAYED_BODY_MAX_LENGTH - 5) + '...'
        else return body + ' ...'
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
                    return <this.SubPage onClick={() => this.handleNewPage(page)}>{page}</this.SubPage>
                }
            })}
        </>
    }

    renderStory = (story) => {
        if (this.state.MarkedStoryIdList.find(s => s === story.storyId)) {
            return <this.Story style={{ backgroundColor: "grey" }} onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px", wordBreak: "break-all" }}>{story.title}</Typography>
                <Typography style={{ textIndent: "10px", wordBreak: "break-all" }}>{tryRenderRichTextFromRawJSON(story.firstPartBody)}</Typography>
            </this.Story>
        }
        else {
            return <this.Story onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px", wordBreak: "break-all" }}>{story.title}</Typography>
                <Typography variant="subtitle1" style={{ textIndent: "10px", wordBreak: "break-all" }}>{tryRenderRichTextFromRawJSON(story.firstPartBody)}</Typography>
            </this.Story>
        }
    }

    render() {
        return <Wrapper>
            <Typography variant="h4" style={{ textIndent: "20px" }}>Choose stories that you want to add to your book</Typography><br />
            <Select
                style={{ width: "200px" }}
                labelId="select"
                id="select"
                value={this.state.type}
                onChange={this.handleMenuChange}
            >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'your favorite'}>Your favorite</MenuItem>
            </Select><br /><br />
            {this.state.StoryList.map(story => {
                return <>
                    <Button size="small" style={{ float: "right" }} onClick={() => window.open(`../story${story.id}`, "_blank")}>Inspect</Button>
                    {this.renderStory(story)}<br />
                </>
            })}
            <Formik
                initialValues={{
                    bookTitle: ''
                }}
                validationSchema={this.ParametersSchema}
                onSubmit={values => {
                    this.sendComposeBookRequest(values)
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormikTextField label="Title of the book" name="bookTitle" style={{ width: "20%" }} /><br />
                        <Button variant="contained" color="primary" type="submit">Create book</Button>
                    </Form>)}
            </Formik>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderPageSelection()}
        </Wrapper>
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(BookCompose)
