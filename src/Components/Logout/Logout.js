import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import setToken from '../../Actions/TokenActions/setToken';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import history from '../../history.js';
import setAvatar from '../../Actions/setAvatar';
import cleanDialogs from '../../Actions/DialogActions/cleanDialogs';
import cleanUncheckedOrders from '../../Actions/OrderActions/cleanUncheckedOrders';


class Logout extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false
        }
    }

    returnStorageToInitialState = () => {
        this.props.setToken(null);
        this.props.setAvatar(null);
        this.props.cleanDialogs();
        this.props.cleanUncheckedOrders();
    }

    handleClick = () => {
        this.setState({
            open: true
        })
    }

    handleConfirm = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('RefreshToken');
        this.returnStorageToInitialState();
        history.push('/');
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
                <Dialog open={this.state.open} >
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
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setToken: token => dispatch(setToken(token)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
        cleanDialogs: () => dispatch(cleanDialogs()),
        cleanUncheckedOrders: () => dispatch(cleanUncheckedOrders())
    };
};

export default connect(null, mapDispatchToProps)(Logout)