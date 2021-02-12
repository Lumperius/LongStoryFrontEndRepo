import React from 'react';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import ReactHtmlParser from 'react-html-parser';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import Wrapper from '../../objects.js';
import buildQuery, { tryRenderRichTextFromRawJSON } from '../../helpers';

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
            page: 1,
            count: 30,
            sortBy: 'date',
            secondStage: false,
            bookTitle: '',
            type: 'all'
        }
    }

    ParametersSchema = Yup.object().shape({
        bookTitle: Yup.string()
            .required('Enter title of the book')
            .max(TITLE_MAX_LENGTH, `Title can\'t be longer than ${TITLE_MAX_LENGTH} symbols`),
    });


    Story = styled.div`
    border: solid 1px;
    &:hover {
        background-color: lightGrey;
    }
    `;


    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
        this.sendGetRequestAndSetNewPage();
    }

    sendComposeBookRequest = (values) => {
        if (!this.state.StoryList?.find(story => story?.isMarked === true)) {
            this.setState({
                message: {
                    body: 'You need to choose stories for the book first.',
                    type: 'error'
                }
            })
            return;
        }

        let MarkedStoryIdList = [];
        this.state.StoryList.map(story => {
            if (story?.isMarked) {
                MarkedStoryIdList.push(story.id);
            }
        })
        const body = {
            StoryIdList: MarkedStoryIdList,
            userId: this.props.token.id,
            title: values.bookTitle
        }
        axiosSetUp().post(buildQuery('/story/collectStories'), body)
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
        if (page < 1) return;
        const queryData = {
            page: page,
            count: this.state.count,
            sortBy: sortBy,
            type: this.state.type
        }
        axiosSetUp().get(buildQuery('/story/getPage', queryData))
            .then((response) => {
                this.setState({
                    StoryList: response.data || [],
                    page: page
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: 'Error occured while downloading stories',
                        type: 'error'
                    }
                })
            })
    };

    sendGetFavoriteStoriesRequest = () => {

    }


    markTheStory = (story) => {
        const newStoriesList = [...this.state.StoryList]
        if (story.isMarked) {
            newStoriesList.find(s => s.id === story.id).isMarked = false
            this.setState({
                StoriesList: newStoriesList
            })
        }
        else {
            newStoriesList.find(s => s.id === story.id).isMarked = true
            this.setState({
                StoriesList: newStoriesList
            })
        }
    }

    cutBody = (body) => {
        if (body.length > DISPLAYED_BODY_MAX_LENGTH + 10)
            return body.substring(0, DISPLAYED_BODY_MAX_LENGTH) + '...'
        else return body + ' ...'
    }

    renderStory = (story) => {
        if (story.isMarked) {
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
        return (<Wrapper>
            <Typography variant="h4" style={{ textIndent: "20px" }}>Choose stories that you want to add to your book</Typography><br />
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
        </Wrapper>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(BookCompose)
