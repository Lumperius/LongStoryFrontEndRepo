import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import renderMessage from '../../message';
import Select from '@material-ui/core/Select';
import UserInfoWindow from '../UserInfoWindow/UserInfoWindow';

class IndexPage extends React.Component {
    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
            popper: {
                open: false,
                userId: '',
                anchorEl: undefined
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
        cursor: pointer;
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
    margin-bottom: -20px;
    font-size: 12px;
    font-family: TimesNewRoman;
    `;
    HrLine = styled.hr`
    border: 1px solid darkgrey;
    margin: -5px;
    `;
    Page = styled.p`
    display: inline-block;
    font-size:28px;
    margin: 30px;
    `;
    SubPage = styled.p`
    display: inline-block;
    &:hover {
        cursor: pointer
    }
    font-size:20px;
    margin: 30px;
    `;
    Rating = styled.p`
    margin: -10px;
    margin-right: 10px;
    padding: 0px;
    font-size: 28px;
    font-weight: 600;
    color: black;
    text-align: right;
    `;
    Avatar = styled.img`
    background-color: white;
    display:inline;
    float: left;
    margin: 0px;
    margin-right: 10px;
    border: 1px solid black;
    `;
    Login = styled.span`
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    `;

    componentDidMount() {
        this.sendGetRequestAndSetNewPage();
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

    sendGetRequestAndSetNewPage = (page = this.state.page, sortBy = this.state.sortBy) => {
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
        if (body && body.length > 1010)
            return body.substring(0, 1000) + '...'
    }


    handleStoryClick = (id) => {
        this.props.history.push(`Story${id}`)
    }

    handleAuthorClick = (event) => {
        this.setState({
            popper: {
                userId: event.currentTarget.id || '',
                anchorEL: event.currentTarget || null,
                open: true
            }
        })
    };

    handleSortButtonClick = () => {
        this.setState({
            openSortMenu: true
        })
    }

    handleClosePopper = () => {
        this.setState({
            popper: {
                open: false
            }
        })
    };

    handleMenuChange = (event) => {
        this.setState({
            sortBy: event.target.value
        })
        this.sendGetRequestAndSetNewPage(undefined, event.target.value);
    }


    renderPageSelection = () => {
        let pages = [];
        for (let i = 2; i > -3; i--) {
            pages.push(this.state.page - i)
        }
        pages = pages.filter(page => page > 0)
        return <>
            {pages.map(page => {
                if (page === this.state.page) {
                    return <>
                        <this.SubPage onClick={() => this.sendGetRequestAndSetNewPage(page)} style={{ fontSize: "30px", border: "solid 1px", padding: "5px" }}>{page}</this.SubPage>
                    </>
                }
                else {
                    return <>
                        <this.SubPage onClick={() => this.sendGetRequestAndSetNewPage(page)}>{page}</this.SubPage>
                    </>
                }
            })}
        </>
    }

    renderAStory = (story) => {
        let info = this.state.UserInfoList.find(ui => ui.userId == story.userId) || ''
        story.firstPartBody = this.cutStoryBody(story.firstPartBody) || story.firstPartBody;
        return <>
            <this.Signature>
                <this.Avatar src={`data:image/jpeg;base64,${info.avatarBase64}`} width="40px" height="40px" />
                <Typography variant="subtitle2">By <this.Login id={story.userId} onClick={this.handleAuthorClick}>{info.userLogin || 'Unknown'}</this.Login> {story.dateSubmitted}</Typography>
            </this.Signature>
            <this.StoryBlock id={story.userId} onClick={() => this.handleStoryClick(story.id)}>
                <Typography variant='h5'>{story.title}</Typography>
                <Typography variant='subtitle1' style={{ wordWrap: "break-word", textIndent: "15px", marginBottom: "10px" }}>{story.firstPartBody}</Typography>
            </this.StoryBlock>
            <this.Rating >{story.rating}</this.Rating>
            <br />
        </>
    }


    render() {
        return (
            <this.Wraper>
                <Popper open={this.state.popper.open} anchorEl={this.state.popper.anchorEL}>
                    <UserInfoWindow userId={this.state.popper.userId} />
                    <Button variant="contained" color="primary" onClick={this.handleClosePopper} style={{ padding: "5px", marginTop: "-20px", float: "right" }}>Close</Button>
                </Popper>
                <Typography variant="button">Sort by: </Typography>
                <Select
                    style={{ width: "5%" }}
                    labelId="select"
                    id="select"
                    value={this.state.sortBy}
                    onChange={this.handleMenuChange}
                >
                    <MenuItem value={'rating'}>Rating</MenuItem>
                    <MenuItem value={'date'}>Date</MenuItem>
                    <MenuItem value={'title'}>Title</MenuItem>
                </Select><br /><br />
                {this.state.StoriesList.map((story) => {
                    return <> {this.renderAStory(story)} </>
                })}
                {renderMessage(this.state.message.body, this.state.message.type)}
                {<Button variant="contained" color="primary" onClick={() => this.sendGetRequestAndSetNewPage(this.state.page - 1)}>Prev</Button>}
                {this.renderPageSelection()}
                {<Button variant="contained" color="primary" onClick={() => this.sendGetRequestAndSetNewPage(this.state.page + 1)}>Next</Button>}
            </this.Wraper>);
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(IndexPage)