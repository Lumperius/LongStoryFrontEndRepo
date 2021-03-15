import axios from 'axios';
import setToken from './Actions/TokenActions/setToken.js';
import buildRequest from './helpers.js';
import history from './history.js';
import store from './Store/ReduxStore.js';
import jwt_decode from 'jwt-decode';


const axiosInstance = axios.create({
    headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
    }
});

axiosInstance.interceptors.response.use(response => {
    if (response.status.toString().startsWith('2')) {
        return response;
    }
    else {
        throw response;
    }
},
    async error => {
        if (error.response.status === 403)
            history.push('/authentication');

        if (error.response.status === 401) {
            if (localStorage.getItem('Token') && localStorage.getItem('RefreshToken')) {
                const refreshToken = localStorage.getItem('RefreshToken');
                localStorage.removeItem('RefreshToken');
                localStorage.removeItem('Token');
                return await sendRefreshTokensRequest(error.response, refreshToken);
            }
            else history.push('/authentication');
        }
        if (error.response.status.toString().startsWith('5')) {
            error.response.data = 'Something bad happend. Contact administrator or try again later'
            throw error.response;
        }
        throw error.response;
    })


const sendRefreshTokensRequest = async (error, refreshToken) => {
    const body = {
        refreshToken: refreshToken
    }
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;
    return await axiosInstance.post(buildRequest('/user/refreshToken'), body)
        .then(async response => {
            localStorage.setItem('Token', response.data.token);
            localStorage.setItem('RefreshToken', response.data.refreshToken);
            store.dispatch(setToken(jwt_decode(response.data.token)));
            return sendInerruptedRequest(error);
        })
}

const sendInerruptedRequest = error => {
    const body = error.data;
    const response = axiosInstance[error.config.method](error.config.url, body);
    return response
}


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

export default function axiosSetUp() {
    return axiosInstance;
}
