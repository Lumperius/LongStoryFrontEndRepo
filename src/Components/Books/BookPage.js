import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';

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
            isUserBooks: false,
            BookList: [],
            Authors: []
        }
    }

    Wraper = styled.div`
    text-align: left;
    margin: 10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    background-color: white;
    `;
    StoryTitle = styled.span`
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    `;


    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
        this.sendGetBooksRequest();
    }

    sendGetBooksRequest = () => {
        axiosSetUp().get(`http://localhost:5002/book/GetPageOfBooks?page=${this.state.page}&count=${this.state.count}&isUserBooks=${this.state.isUserBooks}`)
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
                        body: error.message,
                        type: 'error'
                    }
                })
            })
    }

    sendGetUserInfoRequest = () => {
        let authorIdList = [];
        this.state.BookList.forEach(book => {
            if (!authorIdList.find(id => id == book.authorId))
                authorIdList.push(book.authorId);
        })
        let jsonIds = JSON.stringify(authorIdList);
        axiosSetUp().get(`http://localhost:5002/userInfo/getRange?userIdList=${jsonIds}`)
            .then(response => {
                this.setState({
                    Authors: response.data.userInfoList || []
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: error.data || '',
                        type: 'error'
                    }
                })
            })
    }

    renderABook = (book, index) => {
        debugger
        let authorLogin = this.state.Authors.find(author => author.userId === book.authorId)?.userLogin || 'Undefined'
        return <div style={{ padding: "5px"}}>
            <Typography variant="subtitle"><this.StoryTitle style={{display: "inline", marginBottom: "-10px"}}>{index + 1}: {book.title}</this.StoryTitle></Typography>
            <Typography style={{fontSize: "16px"}}>By {authorLogin}</Typography>
            </div>
    }


    render() {
        return (<this.Wraper>
            {this.state.BookList.map((book, index) => {
                return <>{this.renderABook(book, index)}</>
            })}
            {renderMessage(this.state.message.body, this.state.message.type)}
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Books)
