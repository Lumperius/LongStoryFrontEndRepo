import React  from 'react'
import jwt_decode from 'jwt-decode'

class Service extends React.Component{
    constructor()
    {
        super();
    }

 checkToken = () => {
    if(localStorage.getItem('Token') == null) { return false;}
    else{  let token = localStorage.getItem('Token');
           let tokenData = jwt_decode(token);
           let expirationTime = tokenData.exp;
           let current_time = Date.now() / 1000;
           if (current_time < expirationTime){
               console.log('token is valid');
               return true;
           }
           else{
            console.log('token is not valid');
               return false;
               }
       }
    }

}

export default Service


