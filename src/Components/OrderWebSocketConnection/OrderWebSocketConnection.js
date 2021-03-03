import React from 'react';
import { connect } from 'react-redux';
import connectToHub from '../../hubConnection';
import * as signalR from "@microsoft/signalr";
import { backendDomain } from '../../objects';
import addUncheckedOrder from '../../Actions/OrderActions/addUncheckedOrder';
import addRangeUncheckedOrders from '../../Actions/OrderActions/addRangeUncheckedOrders';

const CONNECTION_TIMEOUT = 10000;
const SOCKET_URL = `${backendDomain}/order/socket`; 

class OrderWebSocketConnection extends React.Component {
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
        if (this.props.token) {
            this.connectToHub();
        }
    }

    connectToHub = () => {
        if (!this.hubConnection || this.hubConnection?.state === signalR.HubConnectionState.Disconnected)
            try {
                (async () => {
                    this.hubConnection = await connectToHub(SOCKET_URL)
                })().then(() => this.registerHandlers())
            }
            catch {
                setTimeout(this.connectToHub(), CONNECTION_TIMEOUT)
            }
    }

    registerHandlers = () => {
        this.hubConnection.invoke('ConnectToHub', this.props.token.id)
        this.hubConnection.on('OrderCreated', recievedMessage => {
            console.log('brrrrr-brrrr')
            this.props.addUncheckedOrder(recievedMessage);
        })
        this.hubConnection.on('Connect', recievedMessage => {
            console.log('brrrrr-brrrr-brrrr')
            this.props.addRangeUncheckedOrders(recievedMessage);
        })
    }

    render() {
        return null
    };
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUncheckedOrder: order => dispatch(addUncheckedOrder(order)),
        addRangeUncheckedOrders: orders => dispatch(addRangeUncheckedOrders(orders))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderWebSocketConnection)
