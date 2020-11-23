const setToken = text => {
    return{
       type: 'SET_TOKEN',
       payload: text
    }
}

export default setToken;