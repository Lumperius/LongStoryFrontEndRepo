import React from 'react'
import jwt_decode from 'jwt-decode'



const getParsedToken = () => {
    if (localStorage.getItem('Token') === null) { return null; }
    else {
        let token = localStorage.getItem('Token');
        let parsedToken = jwt_decode(token);
        return parsedToken;
    }
}

export default getParsedToken


