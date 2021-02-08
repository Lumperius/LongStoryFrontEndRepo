import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import renderMessage from '../../../message';
import Typography from '@material-ui/core/Typography';
import { backendDomain } from '../../../objects';
import Button from '@material-ui/core/Button';
import { loadStripe } from "@stripe/stripe-js";
import buildQuery from '../../../helpers';


class Orders extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            Orders: []
        }
    }

    OrderWrapper = styled.div`
    border: solid 1px;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
    &: hover {
        background-color: gray;
        cursor: pointer;
    }
    `;


    componentDidMount() {
        this.sendGetOrdersRequest();
    }

    sendDeleteOrdersRequest = (sessionId) => {
        const queryData = {
            sessionId: sessionId
        }
        axiosSetUp().delete(buildQuery('/order', queryData))
        .then(response => {
            this.setState({
                message: {
                    body: 'Order deleted',
                    type: 'info'
                }
            })
        })
        .catch(error => {
            this.setState({
                message: {
                    body: 'Error occured while deleting order',
                    type: 'error'
                }
            })
        })
    }

    sendGetOrdersRequest = (sessionId) => {
        const queryData = {
            userId: this.props.token.id
        }
        axiosSetUp().get(buildQuery('/order/getSessions', queryData))
            .then(response => {
                this.setState({
                    Orders: response.data.sessions
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading orders, try again later',
                        type: 'error'
                    }
                })
            })
    }


    handleCancelButtonClick = (sessionId) => {
        this.sendDeleteOrdersRequest(sessionId)
    }

    handleButtonClick = async (sessionId) => {
        const stripePromise = loadStripe('pk_test_51IFyntKGKkWeV1dSDPnoKRgzIynRZqV5mubF4AQ79ZwVqQL5heQbPnLLfjRhAfkDvpi82Yrq1KKEFOIwNAB2DoB700XJa7leJW');
        const stripe = await stripePromise;
        stripe.redirectToCheckout({
            sessionId: sessionId,
        });
    }


    render() {
        return (<>
            <Typography variant="body">List of your orders</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.Orders.map(order => {
                return <>
                    <this.OrderWrapper>
                        <Button
                            variant="contained"
                            size="small"
                            style={{ float: "right", borderRadius: "30px"}}
                            onClick={() => this.handleButtonClick(order.sessionId)}>Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{ float: "right", borderRadius: "30px", marginRight: "10px"}}
                            onClick={() => this.handleCancelButtonClick(order.sessionId)}>Pay
                        </Button>
                        <Typography variant="body" style={{ fontSize: "25px" }}>{order.bookTitle}</Typography>
                        <Typography variant="subtitle1" style={{ fontSize: "15px" }}>{order.dateCreated}</Typography>
                    </this.OrderWrapper>
                </>
            })}
        </>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Orders)