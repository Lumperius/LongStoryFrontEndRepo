import Typography from '@material-ui/core/Typography';


export default function renderMessage(message, type) {
    switch (type) {
        case 'error':
            return <Typography variant="subtitle1" style={{ color: "red" }}>{message}</Typography>
        case 'info':
            return <Typography variant="subtitle1" style={{ color: "black" }}>{message}</Typography>
        case 'success':
            return <Typography variant="subtitle1" style={{ color: "green" }}>{message}</Typography>
    }
}

