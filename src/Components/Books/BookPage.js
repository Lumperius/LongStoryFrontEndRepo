import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import Wrapper from '../../objects';
import buildRequest from '../../helpers';

class Books extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            page: 1,
            count: 10,
            displayAllBooks: true,
            BookList: [],
            Authors: []
        }
    }

    StoryTitle = styled.span`
    display: inline;
    marginBottom: -10px;
    font-weight: 400;
    font-size: 20px;
    &:hover {
        cursor: pointer;
        font-weight: 500;
    }`;
    Page = styled.p`
    display: inline;
    &:hover {
        cursor: pointer
    }
    font-size:10px;
    margin: 30px;
    `;


    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
        this.sendGetBookPageRequest();
    }


    sendGetBookPageRequest = (page = this.state.page, displayAll = this.state.displayAllBooks) => {
        const queryData = {
            page: page,
            count: this.state.count
        }
        if (!displayAll)
            queryData.userId = this.props.token.id
        axiosSetUp().get(buildRequest('/storyBook/getPageOfBooks', queryData))
            .then(response => {
                this.setState({
                    BookList: response.data.books,
                    page: response.data.page
                })
                this.sendGetUserInfoRequest();
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading books',
                        type: 'error'
                    }
                })
            })
    }

    sendGetUserInfoRequest = () => {
        let authorIdList = [];
        this.state.BookList.forEach(book => {
            if (!authorIdList.find(id => id === book.authorId))
                authorIdList.push(book.authorId);
        })
        const jsonIds = JSON.stringify(authorIdList);
        const queryData = {
            userIdList: jsonIds
        }
        axiosSetUp().get(buildRequest('/userInfo/getRange', queryData))
            .then(response => {
                this.setState({
                    Authors: response.data.userInfoList || []
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: 'Error occured while downloading entries',
                        type: 'error'
                    }
                })
            })
    }


    handleModeButtonClick = () => {
        let displayAllBooks;
        if (this.state.displayAllBooks) {
            displayAllBooks = false;
        }
        else {
            displayAllBooks = true;
        }
        this.setState({
            displayAllBooks: displayAllBooks
        })
        this.sendGetBookPageRequest(undefined, displayAllBooks);
    }


    renderPageSelection = () => {
        let pages = [];
        for (let i = 2; i > -3; i--) {
            pages.push(this.state.page - i)
        }
        pages = pages.filter(page => page > 0)
        return <>
            {pages.map(page => {
                if (page === this.state.page) {
                    return <>
                        <this.Page onClick={() => this.sendGetBookPageRequest(page)} style={{ fontSize: "15px", border: "solid 1px", padding: "5px" }}>{page}</this.Page>
                    </>
                }
                else {
                    return <>
                        <this.Page onClick={() => this.sendGetBookPageRequest(page)}>{page}</this.Page>
                    </>
                }
            })}
        </>
    }


    renderModeButton = () => {
        if (this.state.displayAllBooks)
            return <Button variant="outlined" onClick={this.handleModeButtonClick}>
                <span style={{ fontWeight: "800" }}>All books</span>/<span style={{ fontWeight: "300" }}>Your books</span></Button>
        else
            return <Button variant="outlined" onClick={this.handleModeButtonClick}>
                <span style={{ fontWeight: "300" }}>All books</span>/<span style={{ fontWeight: "800" }}>Your books</span></Button>
    }

    renderABook = (book, index) => {
        let authorLogin = this.state.Authors?.find(author => author.userId === book.authorId)?.userLogin || 'Undefined'
        return <div style={{ padding: "5px" }}>
            <this.StoryTitle onClick={() => this.props.history.push(`books/book${book.bookId}`)}>
                {index + 1 + (this.state.page - 1) * this.state.count}: {book.title}
            </this.StoryTitle>
            <Typography style={{ fontWeight: "300", fontSize: "14px", float: "right-bottom" }}>&nbsp;By {authorLogin}</Typography>
            <Typography style={{ fontWeight: "300", fontSize: "14px", float: "right-bottom" }}> {book.dateCreated} </Typography><hr />
        </div>
    }


    render() {
        return (<Wrapper>
            <Button variant="contained" onClick={() => this.props.history.push('/books/composeBook')}
                style={{ float: "right", marginLeft: "10px" }} size="large">Compose new book</Button>
            {this.renderModeButton()}<br />
            {this.state.BookList.map((book, index) => {
                return <>{this.renderABook(book, index)}</>
            })}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.renderPageSelection()}
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Books)
