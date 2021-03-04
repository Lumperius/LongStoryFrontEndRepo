const initialState = {
    UncheckedOrders: []
}

export default function orderReducer(state = initialState, action) {
    let NewArray;
    switch (action.type) {
        case 'ADD_UNCHECKED_ORDER':
            NewArray = [...state.UncheckedOrders];
            NewArray.push(action.payload)
            return { ...state, UncheckedOrders: NewArray }
            
        case 'ADD_RANGE_UNCHECKED_ORDERS':
            NewArray = [...state.UncheckedOrders];
            return { ...state, UncheckedOrders: NewArray.concat(action.payload) }

        case 'REMOVE_UNCHECKED_ORDER':
            NewArray = [...state.UncheckedOrders];
            NewArray
                .splice(NewArray
                    .indexOf(NewArray
                        .find(o => o === action.payload)), 1)
            return { ...state, UncheckedOrders: NewArray }

        case 'CLEAN_UNCHECKED_ORDERS':
            return initialState
            
        default:
            return state
    }
}


