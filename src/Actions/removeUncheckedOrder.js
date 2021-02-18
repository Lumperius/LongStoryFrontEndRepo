const removeUncheckedOrder = text => {
    return{
       type: 'REMOVE_UNCHECKED_ORDER',
       payload: text
    }
}

export default removeUncheckedOrder;