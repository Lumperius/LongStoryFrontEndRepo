import React from 'react';
import Service from '../../Services/Service';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig'

class Welcome extends React.Component{
    service;
    constructor(){
        super();
        this.state = {
    message :''
    }       
 }


    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:90px;
    font-size: 28px;
    `;
    TheButton = styled.button`
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-decoration: none;
    font-size: 20px;
    margin: 100px;
    align-left:true;
    `;
    Text = styled.p`
    font-size: 30px;
    `;

    sendRequest = () => {
        axiosSetUp().get('http://localhost:5002/api/welcome', {
        })
        .then((response) => { console.log(response.data); this.setState({ message: response.data})
        })
        .catch((ex)=> {
            this.props.history.push('authentication');
        }
        )};

    
    render() {
        if(this.state.message !== '' && this.state.message !== undefined){
            return(
                <this.Wraper >
                   {this.state.message}
                </this.Wraper>  );  
        }
        return(
               <this.Wraper >
                         <this.Text>Welcome to the LongStory! Site where you can create incredible stories, along with other users.
                         Just <a href="/registration">register</a> and click join story to start your writing career on this site.</this.Text>
                   <br/>
                   <this.TheButton type="button" onClick={this.sendRequest}>Introduce yourself</this.TheButton>
               </this.Wraper>
        );
    }
}

export default Welcome
