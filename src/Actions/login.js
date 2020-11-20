const login = text => {
    return{
       type: 'authentication/login',
       payload: text
    }
}

export default login;