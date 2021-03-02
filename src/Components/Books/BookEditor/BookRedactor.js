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
            showEditor: false,
            editingPartId: null
        }
    }

    TextPartBlock = styled.div`
    padding: 15px;
    &:hover {
        background-color: AliceBlue;
    }
    `;


    componentDidMount() {
        this.sendGetBooksForAuthorRequest();
    }

    sendCreateBookRequest = () => {
        const title = 'bla bla for now'
        const body = {
            authorId: this.props.token.id,
            title: title
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
                    bookTitle: title
                };
                state.AuthorBookList.push(authorBook);
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
                    currentBookId: response.data.authorBookList[0].bookId
                })
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
                    }
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
        let state = this.state;
        state.book.Parts.push(textPart)
        this.setState(state)
    }

    handleTextPartEdited = (textPart) => {
        let state = Object.assign({}, this.state);
        state.editingPartId = null;
        if(textPart) {
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


    renderStartCreatingABookButton = () => {
        return <Button
            style={{ float: "right" }}
            size="large"
            variant="contained"
            color="primary"
            onClick={() => this.sendCreateBookRequest()}>
            Start new book
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
            <Typography variant="h4" style={{ textAlign: "center" }}>{this.state.book.title}</Typography>
            {this.state.book?.Parts?.map(textPart => {
                return this.renderTextPart(textPart)
            }) || <Typography>No text yet. Click "ADD MORE" button to add new text.</Typography>}
        </>
    }

    renderTextPart = (textPart) => {
        if (this.state.editingPartId === textPart.textPartId)
            return <RedactPartEditor
                textPart={textPart}
                textPartEdited={textPart => this.handleTextPartEdited(textPart)}
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
        else return <Button
            onClick={() => this.setState({
                showEditor: true,
            })}
            variant="outlined">
            Add more
            </Button>
    }


    render() {
        return (<Wrapper>
            {this.renderStartCreatingABookButton()}
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