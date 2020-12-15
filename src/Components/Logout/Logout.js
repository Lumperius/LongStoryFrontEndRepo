import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import setToken from '../../Actions/setToken'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

class Logout extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false
        }
    }

    handleClick = () => {
        this.setState({
            open: true
        })
    }

    handleConfirm = () => {
        localStorage.removeItem('Token');
        this.props.setToken(null);
        //this.props.history.push('/')
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }



    NavBarButton = styled.div`
    text-decoration: none;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    `;

    render() {
        return (
            <>
                <this.NavBarButton onClick={this.handleClick}>
                    Logout
                </this.NavBarButton>
                <Dialog open={this.state.open}>
                    <Typography style={{margin: "30px"}} gutterBottom>
                        Are you sure?
                    </Typography>
                    <MuiDialogActions>
                        <Button style={{margin: "10px"}} autoFocus color="primary" onClick={this.handleConfirm}>
                            Yes
                        </Button>
                        <Button style={{margin: "10px"}} autoFocus color="primary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </MuiDialogActions>
                </Dialog>

                {/* <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    message="Note archived"
                    action={
                        <React.Fragment>
                                UNDO
                        </React.Fragment>
                    }
                /> */}
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setToken: token => dispatch(setToken(token))
    };
};

export default connect(null, mapDispatchToProps)(Logout)