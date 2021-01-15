const initialState = {
    dialogInfo: {
        open: false,
        targetUser: null
    },
    UserDialogs: [],
    UnreadMessages: []
}

export default function dialogReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_DIALOG':
            return { ...state, dialogInfo: action.payload }
        case 'SET_DIALOG_HISTORY':
            if (!action.payload.user) { return state; }
            if (state.UserDialogs.some(dialog => dialog.user === action.payload.user)) {
                let newDialogs = [...state.UserDialogs];
                newDialogs[newDialogs.findIndex(dialog =>
                    dialog.user === action.payload.user)] = action.payload
                return { ...state, UserDialogs: newDialogs }
            }
            else {
                let newDialogs = [...state.UserDialogs];
                newDialogs.push(action.payload);
                return { ...state, UserDialogs: newDialogs }
            }
        case 'ADD_UNREAD_MESSAGE':
            let newUnreadMessages = [...state.UnreadMessages];
            if(!newUnreadMessages.find(messUser => messUser === action.payload))
                newUnreadMessages.push(action.payload);
            return { ...state, UnreadMessages: newUnreadMessages }
        case 'REMOVE_UNREAD_MESSAGE':
            let PrevUnreadMessages = [...state.UnreadMessages];
            let index = PrevUnreadMessages.findIndex(messUser => messUser === action.payload);
            if (typeof(index) === 'number' && index !== -1)
                PrevUnreadMessages.splice(index, 1);
            return { ...state, UnreadMessages: PrevUnreadMessages }
    }
    return state;
}


