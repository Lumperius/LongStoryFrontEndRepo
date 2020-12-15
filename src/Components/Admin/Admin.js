import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {Table, TableRow, TableCell, TableHead, TableBody}from '@material-ui/core';


class Admin extends React.Component {

    constructor() {
        super()
        this.state = {
            List: [],
            page: 1,
            pageSize: 5,
            message: {
                body: '',
                type: ''
            },
        }
    }

    Table = styled.table`
    background-color: #555; 
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    `;
    Cell = styled.td`
    border-style: solid;
    border-width: 2px;
    background-color: #EEE; 
    font-weight: 200;
    margin: 0;
    `;
    TopCell = styled.td`
    border-style: solid;
    border-width: 2px;
    background-color: #999; 
    font-weight: 200;
    margin: 0;
    `;
    Row = styled.tr`
    background-color: lightgrey;
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
    DeleteButton = styled.button`
    background-color: red;
    display: inline-block; 
    border: none;
    align-right:true;
    float: right;
    padding: 10px;
    margin: 2px;
    `;
    BanButton = styled.button`
    background-color: orange;
    display: inline-block; 
    border: none;
    align-right:true;
    float: right;
    padding: 10px;
    margin: 2px;
    `;
    UnbanButton = styled.button`
    background-color: lightgreen;
    display: inline-block; 
    border: none;
    align-right:true;
    float: right;
    padding: 10px;
    margin: 2px;
    `;
    Page = styled.p`
    display: inline-block;
    font-size:28px;
    margin: 30px;
    `;
    ErrorMessage = styled.p` 
    color: red;
    font-size: 14px;
    `;


    componentDidMount() {
        if (this.props.token === undefined || this.props.token.scope !== 'Admin') 
            this.props.history.push('authentication');

        this.sendRequestAndSetNewPage();
    }

    sendRequestAndSetNewPage = (page = this.state.page) => {
        if (page < 1) return;
        axiosSetUp().get(`http://localhost:5002/user/getrange?page=${page - 1}&count=${this.state.pageSize}`)
            .then((response) => {
                this.setState({
                    List: [],
                });
                this.setState({
                    List: response.data,
                    page: page
                })
            })
            .catch((ex) => {
                this.setState({
                    message: {
                        body: ex.data || [],
                        type: 'error'
                    }
                })
                console.log('Failed', ex)
            })
    };

    sendDeleteRequest = (id) => {
        axiosSetUp().delete(`http://localhost:5002/user/id=${id}`)
            .then((response) => {
                console.log(response.data);
                this.sendRequestAndSetNewPage();
                this.setState({});
            })
            .catch((ex) => {
                this.setState({
                    message: {
                        body: ex.data || [],
                        type: 'error'
                    }
                })
                console.log('Failed', ex)
            })
    }

    
    doNothing = (id) => {

    }
    

    renderUserRow = (user) => {
        return <TableRow>
            <TableCell >{user.login}</TableCell> <TableCell>{user.email}</TableCell>
            <TableCell >{user.roleName}</TableCell>
            <TableCell style={{ width: "20%"}}>
                <Button variant="outlined" style={{ backgroundColor: "red" }} key={user.login} onClick={() => this.sendDeleteRequest(user.id)}>Delete</Button>
                <Button variant="outlined" style={{ backgroundColor: "orange", margin: "10px" }} key={user.login} onClick={() => this.doNothing(user.id)}>Ban</Button>
                <Button variant="outlined" style={{ backgroundColor: "green" }} key={user.login} onClick={() => this.doNothing(user.id)}>Unban</Button>
            </TableCell>
        </TableRow>
    }

    renderMessage = () =>{
        switch(this.state.message.type){
            case 'error':
        return <Typography variant="subtitle1" style={{ color: "red" }}>{this.state.message.body}</Typography>
            case 'info':
        return <Typography variant="subtitle1">{this.state.message.body}</Typography>
        }
    }


    render() {
        return (
            <this.Wraper>
                {this.renderMessage()}
                <Table style={{ width: "100%" }}>
                    <TableHead style={{ backgroundColor: "grey" }}>
                        <TableRow >
                            <TableCell>Login</TableCell> <TableCell>Email</TableCell> <TableCell>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.List.map((user) => {
                            return <> {this.renderUserRow(user)}</>
                        })}
                    </TableBody>
                </Table>
                {<Button variant="outlined" color="primary" style={{ margin: "10px" }} onClick={() => this.sendRequestAndSetNewPage(this.state.page)}>Refresh</Button>}
                {<Button variant="contained" color="primary" onClick={() => this.sendRequestAndSetNewPage(this.state.page - 1)}>Prev</Button>}
                <this.Page>{this.state.page}</this.Page>
                {<Button variant="contained" color="primary" onClick={() => this.sendRequestAndSetNewPage(this.state.page + 1)}>Next</Button>}
            </this.Wraper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Admin)