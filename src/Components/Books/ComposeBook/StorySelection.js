import React from 'react';
import { connect } from 'react-redux';
import axiosSetUp from '../../../axiosConfig';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import renderMessage from '../../../message';
import OrderParameters from './OrderParameters';
import ReactHtmlParser from 'react-html-parser';


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
            secondStage: false
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
      if (!this.props.token)
      this.props.history.push('authentication');
        this.sendGetRequestAndSetNewPage();
    }

    sendGetRequestAndSetNewPage = (page = this.state.page, sortBy = this.state.sortBy) => {
        if (page < 1) return;
        axiosSetUp().get(`http://localhost:5002/story/getPage?page=${page - 1}&count=${this.state.count}&sortBy=${sortBy}`)
            .then((response) => {
                this.setState({
                    StoryList: response.data || [],
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
                {story.isMarked || "nope"}
                <Typography variant="h5" style={{ textIndent: "20px" }}>{story.title}</Typography>
                <Typography style={{ textIndent: "10px" }}>{ReactHtmlParser(story.firstPartBody)}</Typography>
            </this.Story>
        }
        else {
            return <this.Story onClick={() => this.markTheStory(story)}>
                <Typography variant="h5" style={{ textIndent: "20px" }}>{story.title}</Typography>
                <Typography variant="subtitle1" style={{ textIndent: "10px" }}>{ReactHtmlParser(story.firstPartBody)}</Typography>
            </this.Story>
        }
    }

    render() {
        if (!this.state.secondStage)
            return (<this.Wraper>
                <Typography variant="h4" style={{ textIndent: "20px" }}>Choose stories that you want to add to your book</Typography><br />
                {this.state.StoryList.map(story => {
                    return <>
                        <Button size="small" style={{ float: "right" }} onClick={() => window.open(`story${story.id}`, "_blank")}>Inspect</Button>
                        {this.renderStory(story)}<br />
                    </>
                })}
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Button variant="contained" color="primary" onClick={() => this.setState({ secondStage: true })}>Create order</Button>
            </this.Wraper>)
        else {
            return (<this.Wraper>
                <OrderParameters StoryList={this.state.StoryList} /><br />
                <Button variant="outlined" size="small" style={{ marginLeft: "-10px" }} onClick={() => this.setState({ secondStage: false })}>back</Button>
            </this.Wraper>)
        }
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(StorySelection)
