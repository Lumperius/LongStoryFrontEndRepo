import tokenReducer from '../Reducers/TokenReducer';
import { combineReducers } from 'redux'
import avatarReducer from '../Reducers/AvatarReducer';

const rootReducer = combineReducers({
    token: tokenReducer,
    avatar: avatarReducer
 })

 export default rootReducer;