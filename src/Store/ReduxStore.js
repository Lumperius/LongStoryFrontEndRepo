import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import { authenticationReducer } from '../Reducers/AthenticationReducer'
import initialState from './InitialState';

const store = configureStore( {reducer: authenticationReducer}, initialState)

export default store;