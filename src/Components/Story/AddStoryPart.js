import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';

class AddStoryPart extends React.Component {

    constructor() {
        super();
        this.state = {
            body: '',
            message: {
                body: '',
                type: ''
            },
        }
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
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: dark;
    background-color: white:
    `;


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    validateRequestParametrs = () => {
        if (!this.state.body || this.state.body.length < 20 || this.state.body >= 4000) {
            this.setState({ message:{
                body: 'Incorrect text of the story part.',
                type: 'error'
                } 
            })
            return false;
        }
        return true;
    }

    sendNewStoryPartRequest = () => {
        if (!this.validateRequestParametrs()) return;
        let requestBody = {
            storyId: this.props.storyId,
            authorId: this.props.token.id,
            body: this.state.body,
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post('http://localhost:5002/storyPart/create', requestBody)
            .then(response => {
                this.props.stopRenderEditor();
                this.setState({
                    message: {
                        body: response.data,
                        type: 'success'
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    message: {
                        body: error.data || [],
                        type: 'error'
                    }
                })
            })
    }


    render() {
        return <>
            <TextareaAutosize  maxLength="4000" name="body" placeholder="Min length is 20 symbols, max - 4000 symbols"
             style={{ fontSize: "20px", width: "90%" }} onChange={this.handleChange} ></TextareaAutosize> <br />
            <Typography variant="subtitle2">{this.state.body.length}/4000</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            <Button variant="contained" color="primary" onClick={this.sendNewStoryPartRequest}>submit</Button>
        </>
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(AddStoryPart)