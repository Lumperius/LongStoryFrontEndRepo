import React from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import Select from '@material-ui/core/Select';

class IndexPage extends React.Component {
    service;
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            StoriesList: [],
            UserInfoList: [],
            page: 1,
            pageSize: 10,
            sortBy: 'rating',
            openSortMenu: false,
        }
    }

    StoryBlock = styled.div`
    margin: 20px;
    padding: 30px;
    padding-bottom: 0px;
    border-style: solid;
    border-width:1px;
    &:hover {
        background-color: lightgrey;
    }
    `;
    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-radius: 10px;
    border-color: dark;
    background-color: white;
    `;
    Title = styled.h2`
    font-family: TimesNewRoman;
    margin-left: 10px;
    `;
    StoryBody = styled.p`
    font-family: TimesNewRoman;
    text-indent: 20px;
    `;
    Signature = styled.p`
    margin-top: 20px;
    font-size: 12px;
    font-family: TimesNewRoman;
    `;
    Line = styled.hr`
    border: 1px solid darkgrey;
    margin: -5px;
    `;
    Page = styled.p`
    display: inline-block;
    font-size:28px;
    margin: 30px;
    `;
    Rating = styled.p`
    margin: 0;
    padding: 0;
    font-size: 28px;
    color: black;
    text-align: right;
    `;
    Avatar = styled.img`
    display:inline;
    float: left;
    margin: 0px;
    margin-right: 10px;
    `;

    componentDidMount() {
        this.sendRequestAndSetNewPage();
    }

    sendGetUserInfoRequest = () => {
        let userIdList = [];
        this.state.StoriesList.forEach(story => {
            if (!userIdList.find(id => id == story.userId))
                userIdList.push(story.userId);
        })
        let jsonIds = JSON.stringify(userIdList);
        axiosSetUp().get(`http://localhost:5002/userInfo/getRange?userIdList=${jsonIds}`)
            .then(response => {
                this.setState({
                    UserInfoList: response.data.userInfoList || []
                })
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: error.data || '',
                        type: 'error'
                    }
                })
            })
    }

    sendRequestAndSetNewPage = (page = this.state.page, sortBy = this.state.sortBy) => {
        if (page < 1) return;
        axiosSetUp().get(`http://localhost:5002/story/getPage?page=${page - 1}&count=${this.state.pageSize}&sortBy=${sortBy}`)
            .then((response) => {
                this.setState({
                    StoriesList: response.data || '',
                    page: page
                })
                this.sendGetUserInfoRequest();
            })
            .catch((error) => {
                console.log('Failed', error)
                this.setState({
                    message: {
                        body: error.data || '',
                        type: 'error'
                    }
                })
            })
    };


    cutStoryBody = (body) => {
        if (body)
            return body.substring(0, 10) + '...'
    }


    handleClick = (id) => {
        this.props.history.push(`Story${id}`)
    }

    handleSortButtonClick = () => {
        this.setState({
            openSortMenu: true
        })
    }


    handleMenuChange = (event) => {
        this.setState({
            sortBy: event.target.value
        })
        this.sendRequestAndSetNewPage( undefined, event.target.value);
    }


    renderAStory = (story) => {
        let info = this.state.UserInfoList.find(ui => ui.userId == story.userId) || ''
        story.body = this.cutStoryBody(story.firstPartBody);
        return <this.StoryBlock onClick={() => this.handleClick(story.id)}>
            <Typography variant='h5'>{story.title}</Typography><br />
            <Typography variant='subtitle1' style={{ wordWrap: "break-word", textIndent: "15px" }}>{story.firstPartBody}</Typography><this.Line />
            <this.Signature>
                <this.Avatar src={`data:image/jpeg;base64,${info.avatarBase64}`} width="40px" height="40px" />
                <Typography variant="subtitle2">By {info.userLogin || 'Unknown'} {story.dateSubmitted}</Typography> <this.Rating >{story.rating}</this.Rating>
            </this.Signature>
        </this.StoryBlock>
    }


    render() {
        return (
            <this.Wraper >
                <Typography variant="button">Sort by: </Typography>
                <Select
                    style={{width: "4%"}}
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={this.state.sortBy}
                    onChange={this.handleMenuChange}
                >
                    <MenuItem value={'rating'}>Rating</MenuItem>
                    <MenuItem value={'date'}>Date</MenuItem>
                    <MenuItem value={'title'}>Title</MenuItem>
                </Select>
                {this.state.StoriesList.map((story) => {
                    return <> {this.renderAStory(story)} </>
                })}
                {renderMessage(this.state.message.body, this.state.message.type)}
                {<Button variant="contained" color="primary" onClick={() => this.sendRequestAndSetNewPage(this.state.page - 1)}>Prev</Button>}
                <this.Page>{this.state.page}</this.Page>
                {<Button variant="contained" color="primary" onClick={() => this.sendRequestAndSetNewPage(this.state.page + 1)}>Next</Button>}
            </this.Wraper>);
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(IndexPage)