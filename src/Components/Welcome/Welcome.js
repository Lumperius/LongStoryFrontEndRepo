import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'

class StartPage extends React.Component {
    service;
    constructor() {
        super();
        this.state = {
            message: '',
            StoriesList: []
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

    componentDidMount(){
        axiosSetUp().get('http://localhost:5002/story/getrange')
            .then((response) => {
                this.setState({
                    StoriesList: response.data,
                })
            })
            .catch((ex) => console.log('Failed', ex))
    }

    displayAStory = (story) =>{
    return <this.StoryBlock>
                <this.Title>{story.title}</this.Title>
                <this.StoryBody>{story.initialBody}</this.StoryBody><this.Line/>
                <this.DateAndMaster>By {story.storyMaster} {story.dateStarted}</this.DateAndMaster> 
                <this.VoteUp></this.VoteUp><this.VoteDown></this.VoteDown>
            </this.StoryBlock>
    }


    sendRequest = () => {
    }

    sendwelcomeRequest = () => {
        axiosSetUp().get('http://localhost:5002/user/welcome', {
        })
            .then((response) => {
                console.log(response.data); this.setState({ message: response.data })
            })
            .catch((ex) => {
                this.props.history.push('authentication');
            }
            )
    };


    render() {
        return (
            <this.Wraper >
                {this.state.StoriesList.map((story, index) => {
                    return <> {this.displayAStory(this.state.StoriesList[index])} </>
                })}
                {this.state.message}
            </this.Wraper>);
    }
}

export default StartPage
