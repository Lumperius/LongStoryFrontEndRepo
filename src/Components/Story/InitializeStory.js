import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';

class InitializeStory extends React.Component {

    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            message: ''
        }
    }


    TitleInput = styled.textarea`
    padding: 5px;
    text-indent: 30px;
    width: 80%;
    height: 40px;
    font-size: 30px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
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
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    margin: 20px;
    `;
    Wraper = styled.div`
    text-align:left;
    margin:10px;
    margin-right: 0px;
    margin-left: 20px;
    font-size: 15px;
    font-weight: 100;
    `;
    InputLabel = styled.h3`
    font-size: 30px;
    margin: 20px;
    `;

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    sendRequest = () => {
        let login = this.props.token.login;
        let body = {
            title: this.state.title,
            body: this.state.firstElementBody,
            userLogin: login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post("http://localhost:5002/story/createStory", body)
            .then(response => {
                this.setState({
                    message: response.data.message,
                    title: '',
                    body: ''
                })
            })
                    .catch(error => {
                        console.log(error)
                        this.setState({
                            message: 'Error occured, try again later'
                        })
                    })
            }

    render(){
                return(
            <this.Wraper >
                    <this.InputLabel>Start a story</this.InputLabel>
                { this.state.message } < br />
                <this.TitleInput name="title" maxLength="80" placeholder="Enter title..." onChange={this.handleChange}></this.TitleInput><br/>
                <this.BodyInput name="firstElementBody" maxLength="2500" placeholder="Enter story here..." onChange={this.handleChange}></this.BodyInput><br/>
                <this.SubmitButton onClick={this.sendRequest}>Submit</this.SubmitButton>
            </this.Wraper >
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(InitializeStory)