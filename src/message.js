import Typography from '@material-ui/core/Typography';


export default function renderMessage(message, type) {
    switch (type) {
        case 'error':
            return <Typography style={{ color: "red", fontWeight: "400", fontSize: "20px" }}>{message}</Typography>
        case 'info':
            return <Typography style={{ color: "black", fontWeight: "400", fontSize: "20px" }}>{message}</Typography>
        case 'success':
            return <Typography style={{ color: "green", fontWeight: "400", fontSize: "20px" }}>{message}</Typography>
        default:
            return null
    }
}

