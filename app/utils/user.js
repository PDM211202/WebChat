

let userList = [
    {
        id: "1",
        username: "ND1",
        room: "r1",
        email: "nd1@gmail.com",
        password: "password"
    }
]

const addUser = (newUser) => (userList = [...userList, newUser]);

const removeUser = (id) => userList = userList.filter((user) => user.id !== id);

const getUserList = (room) => userList.filter((user) => user.room === room);

const findUser = (id) => userList.find((user) => user.id === id);

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
}