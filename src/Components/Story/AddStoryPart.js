import React from 'react';
import styled from 'styled-components'
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';


class AddStoryPart extends React.Component {

    constructor() {
        super();
        this.state = {
            text: '',
            message: ''
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    sendNewStoryPartRequest = () =>{
        debugger
        let requestBody = {
            storyId: this.props.storyId,
            body: this.state.text,
            Author: this.props.token.login,
        }
        axiosSetUp().post('http://localhost:5002/storyPart/create', requestBody)
        .then( response => {
            this.setState({
                message: response.data
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
            <this.BodyInput name="text" onChange={this.handleChange}>Haaai!</this.BodyInput><br/>
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