import React from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'
import Story from '../Story/Story';

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
    VoteUp = styled.button`
    background-color: #759170;
    display: inline-block; 
    border: none;
    align-right:true;
    border-radius: 100px;
    float: right;
    padding: 10px;
    margin: 2px;
    &:hover {
        padding: 15px;
    }`;
    VoteDown = styled.button`
    background-color: #ad7a74; 
    display: inline-block; 
    border: none;
    align-right:true;
    border-radius: 100px;
    float: right;
    padding: 10px;
    margin: 2px;
    &:hover {
        padding: 15px;
    }
    `;
    Title = styled.h2`
    font-family: TimesNewRoman;
    margin-left: 10px;
    `;
    StoryBody = styled.p`
    font-family: TimesNewRoman;
    text-indent: 20px;
    `;
    DateAndMaster = styled.p`
    margin-top: 20px;
    font-size: 12px;
    font-family: TimesNewRoman;
    `;
    Line = styled.hr`
    border: 1px solid darkgrey;
    margin: -15px;
    `;
    Page = styled.p`
    display: inline-block;
    font-size:20px;
    margin: 15px;
    `;
    
    componentDidMount() {
        this.sendRequestAndSetNewPage();
    }

    handleClick = (id) =>{
        this.props.history.push(`Story${id}`)
    }

    modifyDate = (ISOdate) => {
        if (ISOdate) {
            let stringDate = ISOdate.toString();
            stringDate = stringDate.replace('T', ' ');
            stringDate = stringDate.replace('-', '.');
            stringDate = stringDate.replace('-', '.');
            stringDate = stringDate.substring(0, stringDate.length - 4);
            return stringDate;
        }
    }

    displayAStory = (story) => {
        return <this.StoryBlock onClick={() => this.handleClick(story.id)}>
            <this.Title>{story.title}</this.Title>
            <this.StoryBody>{story.firstElementBody}</this.StoryBody><this.Line />
            <this.DateAndMaster>By {story.author} {this.modifyDate(story.dateSubmitted)}</this.DateAndMaster>
            <this.VoteUp></this.VoteUp><this.VoteDown></this.VoteDown>
        </this.StoryBlock>
    }


    sendRequestAndSetNewPage = (page = this.state.page) => {
        if( page < 1 ) return;
        axiosSetUp().get(`http://localhost:5002/story/getrange?page=${page - 1}&count=${this.state.pageSize}`, {})
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


    render() {
        return (
            <this.Wraper >
                {this.state.message}
                {this.state.StoriesList.map((story) => {
                    return <> {this.displayAStory(story)} </>
                })}
                {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page - 1)}>Prev</button>}
                <this.Page>{this.state.page}</this.Page>
                {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page + 1)}>Next</button>}
            </this.Wraper>);
    }
}

export default StartPage
