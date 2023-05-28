// yêu cầu server kết nối với client
const socket = io();

// chuc nang lien quan den join room
const queryString = location.search;

const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true,
});

const { room, username } = params;

// gui yeu cau ket noi den room ben server
socket.emit("join room from client to server", { room, username });