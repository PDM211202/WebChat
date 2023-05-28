const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on("join room from client to server", ({ room, username }) => {
        socket.join(room);

        // gui cho client connection
        socket.emit(
            "send message from server to client",
            createMessage(`Welcome to room ${room}`, "admin")
        );

        // gui cho cac client con lai
        socket.broadcast
            .to(room)
            .emit(
                "send message from server to client",
                createMessage(`${username} vua tham gia vao phong`, "admin")
            );

        // ngat ket noi
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit(
                "send user list from server to client",
                getUserList(room)
            );
        });
    });
});


const port = 4000;
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`);
});