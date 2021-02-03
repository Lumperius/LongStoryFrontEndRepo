import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import renderMessage from '../../../message';
import Typography from '@material-ui/core/Typography';
import { backendDomain } from '../../../objects';
import Button from '@material-ui/core/Button';
import { loadStripe } from "@stripe/stripe-js";


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

    handleButtonClick = async (sessionId) => {
        const stripePromise = loadStripe("pk_test_51IFyntKGKkWeV1dSDPnoKRgzIynRZqV5mubF4AQ79ZwVqQL5heQbPnLLfjRhAfkDvpi82Yrq1KKEFOIwNAB2DoB700XJa7leJW");
        const stripe = await stripePromise;
        stripe.redirectToCheckout({
            sessionId: sessionId,
        });
    }

    sendGetOrdersRequest = () => {
        axiosSetUp().get(`${backendDomain}/order/getSessions?userId=${this.props.token.id}`)
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


    render() {
        return (<>
            <Typography variant="body">List of your orders</Typography>
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.Orders.map(order => {
                return <>
                    <this.OrderWrapper>
                        <Button variant="contained" size="large" color="primary" style={{ float: "right" }} onClick={() => this.handleButtonClick(order.sessionId)}>Commit the payment </Button>
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