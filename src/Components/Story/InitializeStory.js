import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
    text-indent: 20px;
    padding-left: 0px;
    padding-bottom: 0px;
    padding-top: 10px;
    margin-bottom: 10px;
    width: 80%;
    height: 50px;
    font-size: 30px;
    font-family: TimesNewRoman;
    outline: none;
    resize: none;
    `;
    BodyInput = styled.textarea`
    text-indent: 20px;
    padding: 5px;
    width: 80%;
    height: 520px;
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
    margin:50px;
    font-size: 15px;
    font-weight: 100;
    `;
    InputLabel = styled.h3`
    font-size: 30px;
    margin: 20px;
    `;

    componentDidMount() {
        if (this.props.token === undefined) this.props.history.push('authentication');
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    validateRequestParametrs = () => {
        if (!this.state.title || this.state.title.length < 5) {
            this.setState({ message: 'Incorrect title' });
            return false;
        }

        if (!this.state.body || this.state.body.length < 20) {
            this.setState({ message: 'Incorrect initial text of the story' });
            return false;
        }
        return true;
    }

    sendRequest = () => {
        if (!this.validateRequestParametrs()) return;
        let body = {
            userId: this.props.token.id,
            title: this.state.title,
            body: this.state.body,
            author: this.props.token.login,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post("http://localhost:5002/story/createStory", body)
            .then(response => {
                this.setState({
                    message: response.data.message,
                    title: '',
                    body: ''
                })
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    message: 'Error occured, try again later'
                })
            })
    }

    render() {
        return (
            <this.Wraper >
                <Typography variant='h4' align='left' style={{margin: "30px"}} gutterBottom >Start a story</Typography >
                { this.state.message} < br />
                <this.TitleInput name="title" maxLength="80" placeholder="Enter title. It must be at least 5 symbols long" onChange={this.handleChange}></this.TitleInput><br />
                <this.BodyInput name="body" maxLength="4000" placeholder="Enter story here. It must be at least 20 symbols long" onChange={this.handleChange}></this.BodyInput><br />
                <Button variant="contained" color="primary" onClick={this.sendRequest}>Submit</Button>
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