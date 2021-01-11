const initialState = { 
    dialogInfo: {
        open: false,
        targetUser: null
    }
}

export default function dialogReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_DIALOG':
            return { ...state, dialogInfo: action.payload }
        }
    return state;
}


