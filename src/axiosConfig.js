import axios from 'axios';
import jwt_decode from 'jwt-decode';

const axiosInstance = axios.create({ 
    headers: {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('Token')}`
    }
});

axiosInstance.interceptors.request.use( config => {
    const token = localStorage.getItem('Token');
    if(token !== null && token !== undefined){
         let tokenData = jwt_decode(token);
         let expirationTime = tokenData.exp;
         let currentTime = Date.now() / 1000;

        if(expirationTime > currentTime){
        config.headers.Authorization = `Bearer ${localStorage.getItem('Token')}`
        return config;
    }
    }
    else{
        delete config.headers.Authorization
        return config;
    }
})

axiosInstance.interceptors.response.use( function(response) { 
    if( response.status === 200 || response.status === 201){
      return response;
    }
    else { console.log('Error Error!!!!!');
    throw response; }
    }, error => {
     if (error.status === 403 || error.status === 401) {
        console.log('Error Error!!!!!');
    }
    return Promise.reject(error)
})

export default function axiosSetUp(){
    return axiosInstance;
}
