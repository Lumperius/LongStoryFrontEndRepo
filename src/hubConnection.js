import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5002/messenger/chat', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .build();


 async function start(){
    try {
        if(hubConnection.state === signalR.HubConnectionState.Disconnected)
        await hubConnection.start();
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};



export default async function connectToHub() {
    await start();
    return hubConnection;
}
