import React from 'react';
import { connect } from 'react-redux';
import axiosSetUp from '../../axiosConfig';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import renderMessage from '../../message';

class ComposeBook extends React.Component {
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            StoriesList: [],
            page: 1,
            count: 30,
            sortBy: 'date'
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: dark;
    background-color: white;
    `;
    Story = styled.div`
    border: solid 1px;
    &:hover {
        background-color: lightGrey;
    }
    `;


    componentDidMount() {
        if (this.props.token === undefined)
            this.props.history.push('authentication');
        this.sendGetRequestAndSetNewPage();
    }

    sendGetRequestAndSetNewPage = (page = this.state.page, sortBy = this.state.sortBy) => {
        if (page < 1) return;
        axiosSetUp().get(`http://localhost:5002/story/getPage?page=${page - 1}&count=${this.state.count}&sortBy=${sortBy}`)
            .then((response) => {
                this.setState({
                    StoriesList: response.data || [],
                    page: page
                })
                this.sendGetUserInfoRequest();
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
    };

    sendComposeBookRequest = () => {
        let MarkedStoryIdList = [];
        this.state.StoriesList.map(story => {
            if (story?.isMarked) {
                MarkedStoryIdList.push(story.id);
            }
        })
        if (MarkedStoryIdList.length <= 0) {
            this.setState({
                message: {
                    body: 'You need to chose stories for the book first.',
                    type: 'error'
                }
            })
            return;
        }
        let body = {
            StoryIdList: MarkedStoryIdList,
            userId: this.props.token.id
        }
        axiosSetUp().post(`http://localhost:5002/story/collectStories`, body)
            .then(response => {
                let StoriesCopy = [...this.state.StoriesList];
                StoriesCopy.forEach(story => {
                    if (story?.isMarked)
                        story.isMarked = false
                })
                this.setState({
                    message: {
                        body: 'Your request was successfully send',
                        type: 'success'
                    },
                    StoriesList: StoriesCopy
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

    markTheStory = (story) => {
        let newStoriesList = [...this.state.StoriesList]
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
                {story.isMarked || "nope"}
                <Typography variant="h5" style={{ textIndent: "20px" }}>{story.title}</Typography>
                <Typography style={{ textIndent: "10px" }}>{this.cutBody(story.firstPartBody)}</Typography>
            </this.Story>
        }
        else {
            return <this.Story onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px" }}>{story.title}</Typography>
                <Typography variant="subtitle1" style={{ textIndent: "10px" }}>{this.cutBody(story.firstPartBody)}</Typography>
            </this.Story>
        }
    }

    render() {
        return (<this.Wraper>
            <Typography variant="h4" style={{ textIndent: "20px" }}>Choose stories that you want to add to your book</Typography><br />
            {this.state.StoriesList.map(story => {
                return <>
                    <Button size="small" style={{ float: "right" }} onClick={() => window.open(`story${story.id}`, "_blank")}>Inspect</Button>
                    {this.renderStory(story)}<br />
                </>
            })}
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button variant="contained" color="primary" onClick={() => this.sendComposeBookRequest()}>Create order</Button>
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(ComposeBook)
