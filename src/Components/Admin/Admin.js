import React  from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import { connect } from 'react-redux';


class Admin extends React.Component{

    constructor(){
        super()
        this.state = {   
            List: [],
            page: 1,
            pageSize: 5
      }
    }

    Button = styled.button`
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    `;
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

    componentDidMount() {
        this.sendRequestAndSetNewPage();
        if(  this.props.token === undefined || this.props.token.scope !== 'Admin')  this.props.history.push('authentication');
    }
    sendDeleteRequest = (id) => {
        axiosSetUp().delete(`http://localhost:5002/user/id=${id}`)
          .then((response) => { 
              console.log(response.data); 
              this.sendRequest();
             })
           .catch((ex)=> console.log('Failed', ex))   
    }
    displayUserRow = (user) => {
        return <this.Row>
                 <this.Cell>{user.login}</this.Cell> <this.Cell>{user.email}</this.Cell>
                 <this.Cell>{user.roleName}</this.Cell> <this.Cell>{user.id}</this.Cell>
                 <this.Cell><button type="button" key={user.login} onClick={() => this.sendDeleteRequest(user.id)}>Delete</button></this.Cell>
               </this.Row>
    }
    sendRequestAndSetNewPage = (page = this.state.page) => {
        axiosSetUp().get(`http://localhost:5002/user/getrange?from=${(page - 1)*this.state.pageSize}&count=${this.state.pageSize}`)
          .then((response) => { 
             this.setState({ 
                 List: response.data,
                 page: page
                })
            })
          .catch((ex)=> console.log('Failed', ex))   
    };



    render(){
        return(
        <this.Wraper>
            <this.Table>
               
               <this.Row>
                 <this.TopCell>Login</this.TopCell> <this.TopCell>Email</this.TopCell> <this.TopCell>Role</this.TopCell>
                 <this.TopCell>Id</this.TopCell> <this.TopCell></this.TopCell>
               </this.Row>  

                {this.state.List.map((user, index) => {
                    return <> {this.displayUserRow(this.state.List[index]) }</>                          
                    })}

            </this.Table>  
            {<button type="button" onClick={this.sendRequest}>Refresh</button>  }
            {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page + 1)}>Next</button> }
            {<button type="button" onClick={() => this.sendRequestAndSetNewPage(this.state.page - 1)}>Prev</button> }
            <br/>
            <h4>{this.state.page}</h4>
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