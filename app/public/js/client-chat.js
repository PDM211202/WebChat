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

// kiem tra tin nhan va gui den server
document.getElementById("form-messages").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageText = document.getElementById("input-messages").value;
    const acknowledgements = (errors) => {
        if (errors) {
            return alert("tin nhắn không hợp lệ");
        }
        console.log("tin nhắn đã gửi thành công");
    };
    socket.emit(
        "send message from client to server",
        messageText,
        acknowledgements
    );
});

// nhan tin nhan tu server
socket.on("send message from server to client", (message) => {
    const { createAt, messageText, username } = message;
    if (username !== params.username) {
        showMessageOfOthers(username, createAt, messageText)
    } else {
        showMessageOfSender(username, createAt, messageText)
    }
});

// gui vi tri tu user den server
document.getElementById("btn-share-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("trình duyệt đang dùng không có hổ trợ tìm ví");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("share location from client to server", {
            latitude,
            longitude,
        });
    });
});

// nhan data location tu server
socket.on("share location from server to client", (data) => {
    const { createAt, messageText, username } = data;
    if (username !== params.username) {
        showLocationOfOthers(username, createAt, messageText)
    } else {
        showLocationOfSender(username, createAt, messageText)
    }
});


// ----------------------------------------------------------------------------------------------------------------------------------------------

// hien thi tin nhan cua moi nguoi
const showMessageOfOthers = (username, createAt, messageText) => {
    const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="chat-message-left pb-4">
                                      <div>
                                          <img src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                              class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">
                                          <div class="text-muted small text-nowrap mt-2">${createAt}</div>
                                      </div>
                                      <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                          <div class="font-weight-bold mb-1">${username}</div>
                                          ${messageText}
                                      </div>
                                  </div>
  `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

// hien thi tin nhan cua nguoi gui
const showMessageOfSender = (username, createAt, messageText) => {
    const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="chat-message-right mb-4">
    <div>
      <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
        class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
          <div class="text-muted small text-nowrap mt-2">${createAt}</div>
                                    </div>
                                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                        <div class="font-weight-bold mb-1">${username}</div>
                                        ${messageText}
                                    </div>
                                </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

// hien thi vi tri cua nguoi khac
const showLocationOfOthers = (username, createAt, messageText) => {
    const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="chat-message-left mb-4">
      <div>
        <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
          class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
            <div class="text-muted small text-nowrap mt-2">2:43 am</div>
                                      </div>
                                      <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                          <div class="font-weight-bold mb-1">${username}</div>
                                          <a href="${messageText} target="_blank">Vị trí của ${username}</a>
                                      </div>
                                  </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;
}

// hien thi vi tri cua nguoi gui
const showLocationOfSender = (username, createAt, messageText) => {
    const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="chat-message-right mb-4">
      <div>
        <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
          class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
            <div class="text-muted small text-nowrap mt-2">2:43 am</div>
                                      </div>
                                      <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                          <div class="font-weight-bold mb-1">${username}</div>
                                          <a href="${messageText} target="_blank">Vị trí của ${username}</a>
                                      </div>
                                  </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;
}