const addUncheckedOrder = text => {
    return{
       type: 'ADD_UNCHECKED_ORDER',
       payload: text
    }
}

export default addUncheckedOrder;