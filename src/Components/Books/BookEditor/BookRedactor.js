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
            showEditor: false
        }
    }

    TextPartBlock = styled.div`
    background-color: red;
    padding: 15px;
    &:hover {
        background-color: green;
    }
    `;


    componentDidMount() {
        this.sendGetBooksForAuthorRequest();
    }

    sendGetBooksForAuthorRequest = () => {
        const queryData = {
            authorId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/book/getForAuthor', queryData))
            .then(response => {
                this.setState({
                    AuthorBookList: response.data.authorBookList
                })
                this.sendGetBookRequest(this.state.AuthorBookList[0].bookId)
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

    sendGetBookRequest = (bookId) => {
        const queryData = {
            bookId: bookId,
            userId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/book', queryData))
            .then(response => {
                this.setState({
                    book: {
                        title: response.data.title,
                        Parts: response.data.textParts
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
        axiosSetUp().put(buildRequest('\textPart'), body)
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while saving changes, try again later.',
                        type: 'error'
                    }
                })
            })
    }

    renderStartCreatingABookButton = () => {
        return <Button style={{ float: "right" }} size="large" variant="contained" color="primary">Start new book</Button>
    }

    renderBookSelector = () => {
        if (this.state.AuthorBookList.length > 0)
            return <>
                <Select
                    style={{ width: "300px" }}
                    labelId="select"
                    id="select"
                    value={this.state.AuthorBookList[0]?.bookId}
                    onChange={this.handleMenuChange}
                >
                    {this.state.AuthorBookList.map(book => {
                        return <MenuItem value={book.bookId}>
                            <Typography style={{fontWeight: "400", fontSize: "20px"}}>{book.bookTitle}</Typography>
                            </MenuItem>
                    })}
                </Select><br />
            </>
        else return <Typography style={{ fontSize: "22px" }}>You are not participating in writing any books yet</Typography>
    }

    renderBook = () => {
        return <>
            <Typography variant="h3" style={{textAlign: "center"}}>{this.state.book.title}</Typography>
            {this.state.book.Parts.map(textPart => {
                return this.renderTextPart(textPart)
            })}
        </>
    }

    renderTextPart = (textPart) => {
        return <this.TextPartBlock>
            <Typography style={{fontSize: "50px"}}>{ tryRenderRichTextFromRawJSON(textPart.textPartBody)}</Typography>
            <Typography style={{float: "right"}} variant="subtitle2">{ textPart.dateAdded}</Typography>
        </this.TextPartBlock>
    }

    renderNewPartEditor = () => {
        if(this.state.showEditor)
        return <AddNewPartEditor/>
        else return <Button onClick={() => this.setState({showEditor: true})}>
            Add more
            </Button>
    }


    render() {
        return (<Wrapper>
            {this.renderStartCreatingABookButton()}
            {this.renderBookSelector()}
            {this.renderBook()}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderNewPartEditor()}
        </Wrapper>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(BookRedactor)