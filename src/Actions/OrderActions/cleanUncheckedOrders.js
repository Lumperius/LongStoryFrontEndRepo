const cleanUncheckedOrders = text => {
    return{
       type: 'CLEAN_UNCHECKED_ORDERS',
       payload: text
    }
}

export default cleanUncheckedOrders;