import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './Store/ReduxStore';
import {Provider,  connect } from 'react-redux';
import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('Token')}`;
//  axios.interceptors.response.use( function(response) { 
//    if( response.status == 200 || response.status == 201){
//     return response;
//    }
//   else {      console.log('Error Eeeoe!!!!!');
//   throw response; }
// }, error => {
//    if (error.status == 403 || error.status == 401) {
//       console.log('Error Eeeoe!!!!!');
//    }
//    return Promise.reject(error)
// })

ReactDOM.render(
  <Provider store={store}>
      <App/>
  </Provider>,
  document.getElementById('root')
);

