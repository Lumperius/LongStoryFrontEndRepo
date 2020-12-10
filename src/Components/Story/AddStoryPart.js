import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class AddStoryPart extends React.Component {

    constructor() {
        super();
        this.state = {
            body: '',
            message: ''
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    validateRequestParametrs = () => {
        if(!this.state.body || this.state.body.length < 20){
            this.setState({message: 'Incorrect text of the story part'})
            return false;
        }
        return true;
    }

    sendNewStoryPartRequest = () => {
        if(!this.validateRequestParametrs()) return;
        let requestBody = {
            storyId: this.props.storyId,
            authorId: this.props.token.id,
            body: this.state.body,
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post('http://localhost:5002/storyPartCandidate/create', requestBody)
        .then( response => {
            this.setState({
                message: response.data,
            }) 
        })
        .catch( error => {
            console.log(error);
            this.setState({
                message: 'Error occured, try again later'
            })
        })
    }

    BodyInput = styled.textarea`
    text-indent: 20px;
    padding: 5px;
    width: 80%;
    height: 500px;
    font-size: 20px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
    SubmitButton = styled.button`
    `;
    ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    `;
    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:30px;
    padding: 50px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 20px;
    border-color: lightgrey;
    `;

    render() {
        return <this.Wraper>
            <this.ErrorMessage>{this.state.message}</this.ErrorMessage>
            <TextareaAutosize rowsMin={6} name="body" aria-label="empty textarea" style={{fontSize: "20px", width: "90%"}} onChange={this.handleChange}></TextareaAutosize><br/>
            <Button onClick={this.sendNewStoryPartRequest}>submit</Button>
        </this.Wraper>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(AddStoryPart)