import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../message';
 
class ComposeBook extends React.Component {
    constructor(){
        this.state = {
            message: {
                body: '',
                type: ''
            }
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin-top: 1500px;
    margin:10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width:1px;
    border-color: dark;
    background-color: white:
    `;


    componentDidMount(){
        if (this.props.token === undefined) 
        this.props.history.push('authentication');
    }


    renderMessage = () =>{
        switch(this.state.message.type){
            case 'error':
        return <Typography variant="subtitle1" style={{ color: "red" }}>{this.state.message.body}</Typography>
            case 'info':
        return <Typography variant="subtitle1">{this.state.message.body}</Typography>
        }
    }

    render(){
        return(<this.Wraper>
            {renderMessage(this.state.message.body, this.state.message.type)}
        Template
        </this.Wraper>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(ComposeBook)
