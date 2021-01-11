import tokenReducer from '../Reducers/TokenReducer';
import { combineReducers } from 'redux';
import avatarReducer from '../Reducers/AvatarReducer';
import dialogReducer from '../Reducers/DialogReducer';

const rootReducer = combineReducers({
    token: tokenReducer,
    avatar: avatarReducer,
    dialog: dialogReducer,
 })

 export default rootReducer;