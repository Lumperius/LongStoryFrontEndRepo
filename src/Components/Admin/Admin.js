import React  from 'react'
import styled from 'styled-components';
import axios from 'axios';
import axiosSetUp from '../../axiosConfig'


class Admin extends React.Component{

    constructor(){
        super()
        this.state = {   
            List: [
                {Login: 'asf'}
            ]
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


    button = () => {
        return <this.Button type='submit'>Delete user</this.Button>
    }


    displayUserRow = (user) => {
        return <this.Row>
                 <this.Cell>{user.login}</this.Cell> <this.Cell>{user.email}</this.Cell>
                 <this.Cell>{user.roleName}</this.Cell> <this.Cell>{user.id}</this.Cell>
                 <this.Cell>{this.button()}</this.Cell>
               </this.Row>
    }

    sendRequest = () => {
        axiosSetUp();
        axios.get('http://localhost:5002/api/getall')
          .then((response) => { 
             console.log(response.data); 
             this.setState({ List: response.data})
            })
          .catch((ex)=> console.log('Failed', ex))   
    };

    Wraper = styled.div`
    text-align:left;
    margin:90px;
    font-size: 28px;
    `;


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
                    
                    {/* <li key={ user }> 
                                {this.state.List[index].login}   {this.state.List[index].email}  {this.state.List[index].id} 
                           </li>;
                           })} */}
            </this.Table>  
            {<button type="button" onClick={this.sendRequest}>Submit</button>  }
        </this.Wraper>       
        )
    }
}

export default Admin;