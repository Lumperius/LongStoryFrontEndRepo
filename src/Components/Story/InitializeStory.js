import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';

class InitializeStory extends React.Component {

    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            message: {
                body: '',
                type: ''
            },
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
    margin-top: 1500px;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-radius: 10px;
    border-color: dark;
    background-color: white
    `;
    InputLabel = styled.h3`
    font-size: 30px;
    margin: 20px;
    `;

    componentDidMount() {
        if (this.props.token === undefined)
            this.props.history.push('authentication');
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    validateRequestParametrs = () => {
        if (!this.state.title || this.state.title.length < 5 || this.state.title.length >= 50) {
            this.setState({
                message: {
                    body: 'Incorrect title. It must more than 5 and less than 50 symbols.',
                    type: 'error'
                }
            });
            return false;
        }

        if (!this.state.body || this.state.body.length < 20 || this.state.body.length >= 4000) {
            this.setState({
                message: {
                    body: 'Incorrect text. It must more than 20 and less than 4000 symbols.',
                    type: 'error'
                }
            });
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
            authorId: this.props.token.id,
            dateSubmitted: new Date().toISOString()
        }
        axiosSetUp().post("http://localhost:5002/story/createStory", body)
            .then(response => {
                this.setState({
                    message: {
                        body: response.data.message,
                        type: 'success'
                    },
                    title: '',
                    body: ''
                })
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    message: {
                        body: error.data,
                        type: 'error'
                    }
                })
            })
    }

    render() {
        return (
            <this.Wraper >
                <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Start a story</Typography >
                < br />
                <this.TitleInput name="title" maxLength="80" placeholder="Enter title. It must be at least 5 symbols long" onChange={this.handleChange}></this.TitleInput><br/>
                <Typography variant="subtitle2">{this.state.title.length}/80</Typography><br />
                <this.BodyInput name="body" maxLength="4000" placeholder="Enter story here. It must be at least 20 symbols long" onChange={this.handleChange}></this.BodyInput><br />
                <Typography variant="subtitle2">{this.state.body.length}/4000</Typography><br />
                {renderMessage(this.state.message.body, this.state.message.type)}
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