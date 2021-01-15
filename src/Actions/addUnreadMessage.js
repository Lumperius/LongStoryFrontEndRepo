const addUnreadMessage = text => {
    return{
       type: 'ADD_UNREAD_MESSAGE',
       payload: text
    }
}

export default addUnreadMessage;