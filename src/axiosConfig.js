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

axiosInstance.interceptors.response.use( response => {
    if (response.status === 200 || response.status === 201) {
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
    return error.response;
    })

export default function axiosSetUp() {
    return axiosInstance;
}
