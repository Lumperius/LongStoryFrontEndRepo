import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../message';

class Template extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            }
        }
    }

    Wraper = styled.div`
    text-align: left;
    margin: 10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    background-color: white;
    `;


    componentDidMount() {

    }


    render() {
        return (<this.Wraper>
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

export default connect(mapStateToProps)(Template)
