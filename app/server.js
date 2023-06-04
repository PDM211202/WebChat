const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Filter = require("bad-words");
const { createMessage } = require("./utils/create-messages");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");

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

        //chat - xu ly tin nhan tu user gui den va gui lai den moi nguoi trong room
        socket.on("send message from client to server", (messageText, callback) => {
            const filter = new Filter();
            if (filter.isProfane(messageText)) {
                return callback("Profanity is not allowed");
            }

            const id = socket.id;
            const user = findUser(id);

            io.to(room).emit(
                "send message from server to client",
                createMessage(messageText, user.username)
            );
            callback();
        });

        // xu ly chia se vi tri
        socket.on(
            "share location from client to server",
            ({ latitude, longitude }) => {
                const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const id = socket.id;
                const user = findUser(id);
                io.to(room).emit(
                    "share location from server to client",
                    createMessage(linkLocation, user.username)
                );
            }
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