const initialState = {
    dialogInfo: {
        open: false,
        targetUser: null
    },
    UserDialogs: []
}

export default function dialogReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_DIALOG':
            return { ...state, dialogInfo: action.payload }
        case 'SET_DIALOG_HISTORY':
            if(!action.payload.user) {return state; }
            if(state.UserDialogs.some(dialog => dialog.user === action.payload.user)){
                let newDialogs = [...state.UserDialogs];
                newDialogs[newDialogs.findIndex(dialog =>
                    dialog.user === action.payload.user)] = action.payload
                return { ...state, UserDialogs: newDialogs}
               }
               else {
                   let newDialogs = [...state.UserDialogs];
                   newDialogs.push(action.payload);
                   return { ...state, UserDialogs: newDialogs}
               }
    }
    return state;
}


