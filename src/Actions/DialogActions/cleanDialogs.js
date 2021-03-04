const cleanDialogs = text => {
    return{
       type: 'CLEAN_DIALOGS',
       payload: text
    }
}

export default cleanDialogs;