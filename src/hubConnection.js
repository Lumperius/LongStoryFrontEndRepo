import * as signalR from "@microsoft/signalr";

async function start(connectionObject) {
        if (connectionObject.state === signalR.HubConnectionState.Disconnected)
        await connectionObject.start();
};



export default async function connectToHub(hubUrl) {
    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        })
        .build();

    await start(hubConnection);
    return hubConnection;
}
