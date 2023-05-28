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

});

const port = 4000;
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`);
});