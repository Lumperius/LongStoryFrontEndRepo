import React from 'react';
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';


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
            userId: this.props.token.id,
            body: this.state.body,
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post('http://localhost:5002/storyPart/create', requestBody)
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


    render() {
        return <>
            <this.ErrorMessage>{this.state.message}</this.ErrorMessage>
            <this.BodyInput name="body" onChange={this.handleChange}></this.BodyInput><br/>
            <this.SubmitButton onClick={this.sendNewStoryPartRequest}>submit</this.SubmitButton>
        </>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(AddStoryPart)