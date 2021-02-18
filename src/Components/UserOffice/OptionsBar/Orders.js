import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import renderMessage from '../../../message';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { loadStripe } from "@stripe/stripe-js";
import buildRequest from '../../../helpers';


class Orders extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            Orders: [],
            page: 1,
            count: 20
        }
    }

    OrderWrapper = styled.div`
    border: solid 1px;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
    &: hover {
        background-color: grey;
        cursor: pointer;
    }
    `;
    Page = styled.p`
    display: inline-block;
    font-size:28px;
    margin: 30px;
    `;
    SubPage = styled.p`
    display: inline-block;
    &:hover {
        cursor: pointer
    }
    font-size:20px;
    margin: 30px;
    `;



    componentDidMount() {
        this.sendGetOrdersRequest();
    }

    sendDeleteOrdersRequest = (orderId) => {
        const queryData = {
            orderId: orderId
        }
        axiosSetUp().delete(buildRequest('/order/delete', queryData))
            .then(response => {
                let state = this.state;
                state.message = {
                    body: 'Order deleted',
                    type: 'info'
                }
                state.Orders
                    .splice(state.Orders
                        .indexOf(state.Orders
                            .find(o => o.orderId === orderId)), 1)

                this.setState(state);
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

    sendGetOrdersRequest = (page = this.state.page) => {
        const queryData = {
            userId: this.props.token.id,
            page: page,
            count: this.state.count
        }
        axiosSetUp().get(buildRequest('/order/getPage', queryData))
            .then(response => {
                this.setState({
                    Orders: response.data.sessions || [],
                    page: response.data.page
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

    renderTitle = () => {
        if (this.state.Orders.length > 0)
            return <>
                <Typography variant="body">List of your orders</Typography><br />
                {this.renderPageSelection()}
            </>
        else if (this.state.page > 1)
            return <><Typography variant="body">
                No more orders.
                </Typography><br />
                {this.renderPageSelection()}
                </>
        else
            return <Typography variant="body">
                You have no unpaid orders at the moment. To create an order you need to go to the book section and choose a book you would like to order.
                </Typography>

    }

    renderPageSelection = () => {
        let pages = [];
        for (let i = 2; i > -3; i--) {
            pages.push(this.state.page - i)
        }
        pages = pages.filter(page => page >= 1)
        return <>
            {pages.map(page => {
                if (page === this.state.page) {
                    return <this.Page style={{ fontSize: "30px", border: "solid 1px", padding: "5px" }}>{page}</this.Page>
                }
                else {
                    return <this.SubPage onClick={() => this.sendGetOrdersRequest(page)}>{page}</this.SubPage>
                }
            })}
        </>
    }

    render() {
        return (<>
            {this.renderTitle()}
            {renderMessage(this.state.message.body, this.state.message.type)}
            {this.state.Orders.map(order => {
                return <>
                    <this.OrderWrapper>
                        <Button
                            variant="contained"
                            size="small"
                            style={{ float: "right", borderRadius: "30px" }}
                            onClick={() => this.handleCancelButtonClick(order.orderId)}>Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{ float: "right", borderRadius: "30px", marginRight: "10px" }}
                            onClick={() => this.handleButtonClick(order.sessionId)}>Pay
                        </Button>
                        <Typography variant="body" style={{ fontSize: "25px" }}>{order.bookTitle}</Typography>
                        <Typography variant="subtitle1" style={{ fontSize: "15px" }}>{order.dateCreated}</Typography>
                    </this.OrderWrapper>
                </>
            })}<br />
        </>)
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(Orders)