import jwt_decode from 'jwt-decode';

let tokenString = localStorage.getItem('Token');
let token;
if (tokenString !== null && tokenString !== undefined) {
    token = jwt_decode(tokenString);
}
const initialState = {
    tokenObj: token
}

export default function tokenReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_TOKEN':
            return { ...state, tokenObj: action.payload }
        default:
            return state
    }
}


