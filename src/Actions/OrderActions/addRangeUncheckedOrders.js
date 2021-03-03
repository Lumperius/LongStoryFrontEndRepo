const addRangeUncheckedOrders = text => {
    return{
       type: 'ADD_RANGE_UNCHECKED_ORDERS',
       payload: text
    }
}

export default addRangeUncheckedOrders;