import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import axiosSetUp from '../../axiosConfig';
import Wrapper from '../../objects';
import buildRequest, { tryRenderRichTextFromRawJSON } from '../../helpers';


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


    componentDidMount() {
        this.sendGetBookByIdRequest()
    }

    sendGetBookByIdRequest = () => {
        const queryData = {
            bookId: this.props.match.params.bookId
        }
        axiosSetUp().get(buildRequest('/book/getById', queryData))
            .then(response => {
                this.setState({
                    book: response.data
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Book downloading is failed',
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return (<Wrapper>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button variant="contained" color="primary" onClick={() => this.props.history.push(`/books/orderBook${this.props.match.params.bookId}`)}
                style={{ float: "right" }} size="large">Order this book</Button>
            <Typography variant="h3">{this.state.book?.title || 'Unknown'}</Typography>
            <Typography>{tryRenderRichTextFromRawJSON(this.state.book?.body) || 'Text loading is failed'}</Typography><br/>
        </Wrapper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Book)
