import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button'

class Admin extends React.Component {

    constructor() {
        super()
        this.state = {
            List: [],
            page: 1,
            pageSize: 5
        }
    }

    // Button = styled.button`
    // background-color: #333; 
    // border: none;
    // color: white;
    // padding: 15px 32px;
    // text-align: center;
    // text-decoration: none;
    // display: inline-block;
    // font-size: 20px;
    // `;
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
    margin:90px;
    font-size: 28px;
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




    componentDidMount() {
        this.sendRequestAndSetNewPage();
        if (this.props.token === undefined || this.props.token.scope !== 'Admin') this.props.history.push('authentication');
    }

    sendDeleteRequest = (id) => {
        axiosSetUp().delete(`http://localhost:5002/user/id=${id}`)
            .then((response) => {
                console.log(response.data);
                this.sendRequestAndSetNewPage();
                this.setState({});
            })
            .catch((ex) => console.log('Failed', ex))
    }

    doNothing = (id) => {
        
    }

    displayUserRow = (user) => {
        return <this.Row>
            <this.Cell>{user.login}</this.Cell> <this.Cell>{user.email}</this.Cell>
            <this.Cell>{user.roleName}</this.Cell> 
            <this.Cell>
                <Button variant="contained" style={{backgroundColor: "red"}} key={user.login} onClick={() => this.sendDeleteRequest(user.id)}>Delete</Button>
                <Button variant="outlined" style={{backgroundColor: "orange", margin: "10px"}} key={user.login} onClick={() => this.doNothing(user.id)}>Ban</Button>
                <Button variant="contained" style={{backgroundColor: "green"}} key={user.login} onClick={() => this.doNothing(user.id)}>Unban</Button>
            </this.Cell>
        </this.Row>
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
            .catch((ex) => console.log('Failed', ex))
    };



    render() {
        return (
            <this.Wraper>
                <this.Table>

                    <this.Row>
                        <this.TopCell>Login</this.TopCell> <this.TopCell>Email</this.TopCell> <this.TopCell>Role</this.TopCell><this.TopCell></this.TopCell>
                    </this.Row>
                    {this.state.List.map((user) => {
                        return <> {this.displayUserRow(user)}</>
                    })}

                </this.Table>
                {<Button variant="outlined" color="primary" style={{margin: "10px"}} onClick={() => this.sendRequestAndSetNewPage(this.state.page)}>Refresh</Button>}
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