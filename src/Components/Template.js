import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../message';
import Wrapper from '../objects';

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


    componentDidMount() {

    }


    render() {
        return (<Wrapper>
            {renderMessage(this.state.message.body, this.state.message.type)}
            Template
        </Wrapper>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Template)
