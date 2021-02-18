import tokenReducer from '../Reducers/TokenReducer';
import { combineReducers } from 'redux';
import avatarReducer from '../Reducers/AvatarReducer';
import dialogReducer from '../Reducers/DialogReducer';
import orderReducer from '../Reducers/OrderReducer';

const rootReducer = combineReducers({
    token: tokenReducer,
    avatar: avatarReducer,
    dialog: dialogReducer,
    order: orderReducer
 })

 export default rootReducer;