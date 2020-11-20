import Service from '../Services/Service'

var _service = new Service();
const initialState = { isAuthenticated: _service.checkToken() }
export function authenticationReducer(state = initialState, action){
    if (action.type === 'authentication/login') {
        return {
            isAuthenticated: action.payload
            }}
        else{
            return state;
        }
}

