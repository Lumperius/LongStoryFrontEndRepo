import React from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';

class StartPage extends React.Component {
    service;
    constructor() {
        super();
        this.state = {
            message: '',
            StoriesList: [],
            page: 1,
            pageSize: 5
        }
    }


    StoryBlock = styled.div`
    margin: 20px;
    padding: 15px;
    background-color: lightgrey;
    &:hover {
        background-color: grey;
    }`;
    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:90px;
    font-size: 28px;
    `;
    Title = styled.h2`
    font-family: TimesNewRoman;
    margin-left: 10px;
    `;
    StoryBody = styled.p`
    font-family: TimesNewRoman;
    text-indent: 20px;
    `;
    Signature = styled.p`
    margin-top: 20px;
    font-size: 12px;
    font-family: TimesNewRoman;
    `;
    Line = styled.hr`
    border: 1px solid darkgrey;
    margin: -5px;
    `;
    Page = styled.p`
    display: inline-block;
    font-size:20px;
    margin: 15px;
    `;
    Rating = styled.p`
    margin: 0;
    padding: 0;
    font-size: 28px;
    color: darkred;
    text-align: right;
    `;

    componentDidMount() {
        this.sendRequestAndSetNewPage();
    }

    handleClick = (id) =>{
        this.props.history.push(`Story${id}`)
    }


    sendRequestAndSetNewPage = (page = this.state.page) => {
        if( page < 1 ) return;
        axiosSetUp().get(`http://localhost:5002/story/getrange?page=${page - 1}&count=${this.state.pageSize}`)
            .then((response) => {
                this.setState({
                    StoriesList: response.data,
                    page: page
                })
            })
            .catch((ex) => {
                console.log('Failed', ex)
            })
    };

    renderAStory = (story) => {
        return <this.StoryBlock onClick={() => this.handleClick(story.id)}>
            <this.Title>{story.title}</this.Title>
            <TextField  value={story.firstElementBody} margin='normal'/><this.Line />
    <this.Signature>
        By {story.author} {story.dateSubmitted} <this.Rating >{story.rating}</this.Rating>
    </this.Signature>
        </this.StoryBlock>
    }

    render() {
        return (
            <this.Wraper >
                {this.state.message}
                {this.state.StoriesList.map((story) => {
                    return <> {this.renderAStory(story)} </>
                })}
                {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page - 1)}>Prev</button>}
                <this.Page>{this.state.page}</this.Page>
                {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page + 1)}>Next</button>}
            </this.Wraper>);
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(StartPage)