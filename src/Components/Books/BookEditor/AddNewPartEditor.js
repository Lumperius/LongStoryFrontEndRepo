import React from 'react';
import { connect } from 'react-redux';
import renderMessage from '../../../message';
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertToRaw } from 'draft-js';

class AddNewPartEditor extends React.Component {
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
        return (<Editor>
            {renderMessage(this.state.message.body, this.state.message.type)}
            Template
        </Editor>)
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(AddNewPartEditor)