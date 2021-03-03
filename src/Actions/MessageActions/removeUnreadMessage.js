const removeUnreadMessage = text => {
    return{
       type: 'REMOVE_UNREAD_MESSAGE',
       payload: text
    }
}

export default removeUnreadMessage;