const initialState = {
    userInfo: null
}

export default function tokenReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER_INFO':
            return { ...state, userInfo: action.payload }
    }
    return state;
}


