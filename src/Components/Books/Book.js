import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import ReactHtmlParser from 'react-html-parser';


class Book extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            book: null
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


    componentDidMount() {
        this.sendGetBookByIdRequest()
    }

    sendGetBookByIdRequest = () => {
        debugger
        let bookId = this.props.match.params.id;
        axiosSetUp().get(`http://localhost:5002/book/getById?bookId=${bookId}`)
            .then(response => {
                this.setState({
                    book: response.data
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Book uploading is failed',
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return (<this.Wraper>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Typography variant="h3">{this.state.book?.title}</Typography>
            <Typography>{ReactHtmlParser(this.state.book?.body)}</Typography>
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Book)
