import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axiosSetUp from '../../../axiosConfig';
import renderMessage from '../../../message';
import Typography from '@material-ui/core/Typography';
import { domain } from '../../../objects';

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

    sendGetOrdersRequest = () => {
        axiosSetUp().get(`${domain}/order/getSessions?userId=${this.props.token.id}`)
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
                        <Typography variant="body" style={{fontSize: "25px"}}>{order.bookTitle}</Typography>
                        <Typography variant="subtitle1" style={{float: "right", fontSize: "15px"}}>{order.dateCreated}</Typography>
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