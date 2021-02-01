import React from 'react';
import { connect } from 'react-redux';
import axiosSetUp from '../../../axiosConfig';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../../message';
import ReactHtmlParser from 'react-html-parser';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import Wrapper from '../../../objects';


class StorySelection extends React.Component {
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
            bookTitle: ''
        }
    }

    ParametersSchema = Yup.object().shape({
        bookTitle: Yup.string()
            .required('Enter title of the book')
            .max(100, 'Title can\'t be longer than 100 symbols'),
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
        debugger
        if (!this.state.StoryList?.find(story => story?.isMarked === true )) {
            this.setState({
                message: {
                    body: 'You need to choose stories for the book first.',
                    type: 'error'
                }
            })
            return;
        }

        let MarkedStoryIdList = [];
        this.state.StoryList.foreach(story => {
            if (story?.isMarked) {
                MarkedStoryIdList.push(story.id);
            }
        })
        let body = {
            StoryIdList: MarkedStoryIdList,
            userId: this.props.token.id,
            title: values.bookTitle
        }
        axiosSetUp().post(`http://localhost:5002/story/collectStories`, body)
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
        axiosSetUp().get(`http://localhost:5002/story/getPage?page=${page}&count=${this.state.count}&sortBy=${sortBy}`)
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


    markTheStory = (story) => {
        let newStoriesList = [...this.state.StoryList]
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
        if (body.length > 110)
            return body.substring(0, 100) + '...'
        else return body + ' ...'
    }

    renderStory = (story) => {
        if (story.isMarked) {
            return <this.Story style={{ backgroundColor: "grey" }} onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px", wordBreak: "break-all" }}>{story.title}</Typography>
                <Typography style={{ textIndent: "10px", wordBreak: "break-all" }}>{ReactHtmlParser(story.firstPartBody)}</Typography>
            </this.Story>
        }
        else {
            return <this.Story onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px", wordBreak: "break-all" }}>{story.title}</Typography>
                <Typography variant="subtitle1" style={{ textIndent: "10px", wordBreak: "break-all" }}>{ReactHtmlParser(story.firstPartBody)}</Typography>
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
                initialValues = {{
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
                        <Button variant="contained" color="primary" type="submit">Create order</Button>
                    </Form>)}
            </Formik>
            {renderMessage(this.state.message.body, this.state.message.type)}
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(StorySelection)
