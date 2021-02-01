const initialState = {
    avatar: null
}

export default function avatarReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_AVATAR':
            return { ...state, avatar: action.payload }
        default:
            return state;
    }
}


