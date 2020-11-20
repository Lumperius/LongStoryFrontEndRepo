import axios from 'axios';
const axiosInstance = axios.create({ 
    headers: {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('Token')}`
    }
});

axiosInstance.interceptors.request.use( config => {
    const token = localStorage.getItem('Token');

    if(token != null || token != undefined){
        config.headers.Authorization = `Bearer ${localStorage.getItem('Token')}`
    }
    else{
        delete config.headers.Authorization
    }
})

axiosInstance.interceptors.response.use( function(response) { 
    if( response.status == 200 || response.status == 201){
      return response;
    }
    else { console.log('Error Eeeoe!!!!!');
    throw response; }
    }, error => {
     if (error.status == 403 || error.status == 401) {
        console.log('Error Eeeoe!!!!!');
    }
    return Promise.reject(error)
})

export default function axiosSetUp(){
    return axiosInstance;
}
