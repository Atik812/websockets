import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let allsockets = [];
wss.on("connection", (socket) => {
    //@ts-ignore
    allsockets.push(socket);
    console.log("connected users");
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allsockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            // const currentroom = allsockets.find((x)=> x.socket == socket).room
            let currentroom = null;
            for (let i = 0; i < allsockets.length; i++) {
                if (allsockets[i]?.socket == socket) {
                    currentroom = allsockets[i]?.room;
                }
            }
            for (let i = 0; i < allsockets.length; i++) {
                if (allsockets[i]?.room === currentroom) {
                    allsockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    // socket.on("disconnect",()=>{
    //     allsockets = allsockets.filter(x=> x!=socket)
    // })
});
//# sourceMappingURL=index.js.map