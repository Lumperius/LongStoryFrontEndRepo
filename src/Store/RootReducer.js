import tokenReducer from '../Reducers/TokenReducer';
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    token: tokenReducer,
 })

 export default rootReducer;