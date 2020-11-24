import React  from 'react'
import styled from 'styled-components';


class Info extends React.Component{

    constructor(){
        super()
        this.state = {   
      }
    }


    Wraper = styled.div`
    text-align:left;
    margin:10px;
    margin-right: 20px;
    margin-left: 20px;
    font-size: 15px;
    font-weight: 100;
    `;


    render(){
        return(
            <this.Wraper>Info</this.Wraper>
        )
    }
}

export default Info;