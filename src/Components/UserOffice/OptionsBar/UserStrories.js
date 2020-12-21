import React  from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../../message';


class UserStories extends React.Component{

    constructor(){
        super()
        this.state = {   
            message: {
                body: '',
                type: ''
            },
            render: 'stories',
            storiesList: [],
            storyPartsList: []
      }
    }

    Wraper = styled.div`
    text-align:left;
    margin:30px;
    padding: 50px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 20px;
    border-color: lightgrey;
    `;


    componentDidMount(){
        if (this.props.token === undefined) 
        this.props.history.push('authentication');   
        this.sendGetStoriesRequest();
    }


    sendGetStoriesRequest = () => {
        let userId = this.props.token.id;
        axiosSetUp().get(`http://localhost:5002/story/getForUser?userId=${userId}`)
        .then(response => {
            this.setState({
                storiesList: response.data.storiesList,
                storyPartsList: response.data.storyPartsList
            })
        })
        .catch(error => {
            this.setState({
                message: {
                    body: error.data,
                    type: 'error'
                }
            })
        })
    }

    handleClick = (render) =>{
       this.setState({render: render})
    }

    renderList = () => {
        switch(this.state.render){
            case 'stories':
                return <>
                {this.state.storiesList.map((story) => {return  <>
                    {this.renderStory(story)}
                    </>})}</>
            case 'storyParts':
                return <>
                {this.state.storyPartsList.map((storyPart) => {return  <>
                    {this.renderStoryPart(storyPart)}
                    </>})}</>   
            }
    }

    renderStory = (story) =>{
        return<>
        <Typography variant="h5">{story.title}</Typography><br />
        <Typography variant="body1" style={{ textIndent: "15px"}}>{story.body}</Typography><br/>
        <Typography variant="subtitle1">{story.dateSubmitted}</Typography><hr />
        </>
     };
 
     renderStoryPart = (storyPart) =>{
        return<>
         <Typography variant="caption" style={{textAlign: "right"}}>From: {storyPart.titleOfStory}</Typography><br />
         {storyPart.body}<hr />
         </>
      }
 

    render(){
        return(
            <>
                <Typography variant="title1">Your stories</Typography><br /><br />
                {renderMessage(this.state.message.body, this.state.message.type)}
                <Button variant="outlined" onClick={() => this.handleClick('stories')}>Stories</Button>
                <Button variant="outlined" onClick={() => this.handleClick('storyParts')}>Story parts</Button><br/><br/>
                {this.renderList()}
            </>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(UserStories)