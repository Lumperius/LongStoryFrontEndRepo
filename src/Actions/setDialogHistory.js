const setDialogHistory = text => {
    return{
       type: 'SET_DIALOG_HISTORY',
       payload: text
    }
}

export default setDialogHistory;