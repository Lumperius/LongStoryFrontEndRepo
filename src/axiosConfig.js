import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useHistory } from "react-router-dom";

const axiosInstance = axios.create({
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('Token');
    if (token) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('Token')}`
    }
    else {
        localStorage.removeItem('Token');
        delete config.headers.Authorization
    }
    return config;
})

axiosInstance.interceptors.response.use(response => {
    if (response.status.toString().startsWith('2')) {
        return response;
    }
    else {
        throw response;
    }
},
    error => {
        debugger
        if (error.response.status === 403 || error.response.status === 401) {
            localStorage.removeItem('Token');
            let history = useHistory();
            history.push('/authentication');
        }
        if (error.response.status.toString().startsWith('5')){
            error.response.data = 'Something bad happend. Contact administrator or try again later'
        }
        return error.response;
    })

export default function axiosSetUp() {
    return axiosInstance;
}
