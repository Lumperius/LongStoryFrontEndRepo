import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import axiosSetUp from '../../../axiosConfig';
import buildRequest, { tryRenderRichTextFromRawJSON } from '../../../helpers';
import renderMessage from '../../../message';
import Wrapper from '../../../objects';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AddNewPartEditor from './AddNewPartEditor';
import RedactPartEditor from './RedactPartEditor';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';

const MAX_TITLE_LENGTH = 100;

class BookRedactor extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            book: {
                title: '',
                Parts: []
            },
            AuthorBookList: [],
            currentBookId: null,
            editingPartId: null,
            showEditor: false,
            isCreatingNewBook: false
        }
    }

    NewBookSchema = Yup.object().shape({
        title: Yup.string()
            .required('Required')
            .max(MAX_TITLE_LENGTH, 'Max title length is 100 symbols'),
    })


    TextPartBlock = styled.div`
    padding: 15px;
    &:hover {
        background-color: AliceBlue;
    }
    `;


    componentDidMount() {
        this.sendGetBooksForAuthorRequest();
    }

    sendCreateBookRequest = (values) => {
        const body = {
            authorId: this.props.token.id,
            title: values.title
        }
        axiosSetUp().post(buildRequest('/book'), body)
            .then(response => {
                let state = this.state;
                state.message = {
                    body: 'Book successfully created',
                    type: 'success'
                };
                const authorBook = {
                    bookId: response.data.bookId,
                    bookTitle: values.title
                };
                state.AuthorBookList.push(authorBook);
                this.sendGetBookRequest(response.data.bookId);
                this.setState(state);
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while creating the book, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    sendGetBooksForAuthorRequest = () => {
        const queryData = {
            authorId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/book/getForAuthor', queryData))
            .then(response => {
                this.setState({
                    AuthorBookList: response.data.authorBookList,
                    currentBookId: response.data.authorBookList[0]?.bookId || null
                })
                if (response.data.authorBookList.length > 0)
                    this.sendGetBookRequest()
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Failed to load data from server, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    sendGetBookRequest = (bookId = this.state.currentBookId) => {
        const queryData = {
            bookId: bookId,
            userId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/book', queryData))
            .then(response => {
                this.setState({
                    book: {
                        title: response.data.title || 'Undefined',
                        Parts: response.data.textParts || []
                    },
                    currentBookId: bookId
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Failed to load the book, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    sendEditTextPartRequest = (textPartId, textPartBody) => {
        const body = {
            textPartId: textPartId,
            textPartBody: textPartBody
        }
        axiosSetUp().put(buildRequest('/textPart'), body)
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while saving changes, try again later.',
                        type: 'error'
                    }
                })
            })
    }


    handleTextPartClick = (textPart) => {
        this.setState({
            editingPartId: textPart.textPartId
        });
    }

    handleMenuChange = (event) => {
        this.setState({
            currentBookId: event.target.value
        })
        this.sendGetBookRequest(event.target.value);
    }

    handleTextPartCreated = (textPart) => {
        let state = Object.assign({}, this.state);
        state.book.Parts.push(textPart)
        this.setState(state)
    }

    handleTextPartEdited = (textPart) => {
        let state = Object.assign({}, this.state);
        state.editingPartId = null;
        if (textPart) {
            state.book.Parts.find(tp => tp.textPartId === textPart.textPartId)
                .textPartBody = textPart.textPartBody;
        }
        this.setState(state);
    }

    handleCloseEditor = () => {
        this.setState({
            showEditor: false
        })
    }

    handleTextPartDeleted = (textPart) => {
        let state = Object.assign({}, this.state);
        state.editingPartId = null;
        state.book.Parts.splice(state.book.Parts.indexOf(p => p === textPart) - 1, 1)
        this.setState(state);
    }


    renderStartNewBookButton = () => {
        if (this.state.isCreatingNewBook)
            return <Formik
                initialValues={{
                    title: '',
                }}
                validationSchema={this.NewBookSchema}
                onSubmit={values => this.sendCreateBookRequest(values)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Button
                            style={{ float: "right" }}
                            size="large"
                            variant="contained"
                            color="primary"
                            type="submit">
                            Create
                        </Button>
                        <FormikTextField label="Title of the book" name="title" type="text" style={{ width: "20%", float: "right", margin: "10px" }} />
                    </Form>
                )}
            </Formik>
        else
            return <Button
                style={{ float: "right" }}
                size="large"
                variant="contained"
                color="primary"
                onClick={() => this.setState({ isCreatingNewBook: true })}>
                Create new book
        </Button>
    }

    renderBookSelector = () => {
        if (this.state.AuthorBookList.length > 0)
            return <>
                <Select
                    style={{ width: "300px" }}
                    labelId="select"
                    id="select"
                    value={this.state.currentBookId}
                    onChange={this.handleMenuChange}>

                    {this.state.AuthorBookList.map(book => {
                        return <MenuItem value={book.bookId}>
                            <Typography style={{ fontWeight: "400", fontSize: "20px" }}>{book.bookTitle}</Typography>
                        </MenuItem>
                    })}
                </Select><br />
            </>
        else return <Typography style={{ fontSize: "22px" }}>You are not participating in writing any books yet</Typography>
    }

    renderBook = () => {
        return <>
            {this.renderTitle()}
            {this.state.book?.Parts?.map(textPart => {
                return this.renderTextPart(textPart)
            }) || <Typography>No text yet. Click "ADD MORE" button to add new text.</Typography>}
        </>
    }

    renderTitle = () => {
        return <Typography variant="h4" style={{ textAlign: "center" }} >{this.state.book?.title || null}</Typography>
    }

    renderTextPart = (textPart) => {
        if (this.state.editingPartId === textPart.textPartId)
            return <RedactPartEditor
                textPart={textPart}
                textPartEdited={textPart => this.handleTextPartEdited(textPart)}
                textPartDeleted={textPart => this.handleTextPartDeleted(textPart)}
            />
        else
            return <this.TextPartBlock onClick={() => this.handleTextPartClick(textPart)}>
                <Typography>{tryRenderRichTextFromRawJSON(textPart.textPartBody)}</Typography>
                <Typography style={{ float: "right" }} variant="subtitle2">{textPart.dateAdded}</Typography>
            </this.TextPartBlock>
    }

    renderEditor = () => {
        if (this.state.showEditor)
            return <AddNewPartEditor
                bookId={this.state.currentBookId}
                textPart={this.state.editedPart}
                textPartCreated={textPart => this.handleTextPartCreated(textPart)}
                closeEditor={() => this.handleCloseEditor()}
            />
        else if(this.state.currentBookId) return <Button
            onClick={() => this.setState({
                showEditor: true,
            })}
            variant="outlined">
            Add more
            </Button>
    }


    render() {
        return (<Wrapper>
            {this.renderStartNewBookButton()}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderBookSelector()}<br />
            <a href="#editor"><Typography variant="caption" id="Comments">Go to editor</Typography></a>
            {this.renderBook()}<br />
            <span id="editor">{this.state.renderEditor || this.renderEditor()}</span>
        </Wrapper>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(BookRedactor)