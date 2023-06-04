const formatTime = require('date-format');

const createMessage = (messageText, username, imageName = null) => {
    return {
        messageText,
        username,
        createAt: formatTime("hh:mm", new Date()),
        imageName
    }
}

module.exports = { createMessage };