import React  from 'react'
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../../message';

class Settings extends React.Component{

    constructor(){
        super()
        this.state = {   
      }
    }

    componentDidMount = () => {
        if (this.props.token === undefined) 
        this.props.history.push('authentication');   
    }


    render(){
        return(
            <>
               {renderMessage(this.state.message.body, this.state.message.type)}
               <Typography variant="title1">Your settings</Typography><br /><br />
            </>
        )
    }
}

export default Settings;