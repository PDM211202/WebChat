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

window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input-img');
    const customButton = document.getElementById('btn-send-img');

    customButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;

        const messageText = document.getElementById("input-messages").value;
        const formData = new FormData(); // Create a new FormData object
        formData.append("image", files[0]);
        // Make a POST request to the API
        fetch("http://localhost:4000/upload/image", {
            method: "POST",
            body: formData,
        })
        const acknowledgements = (errors) => {
            if (errors) {
                return alert("tin nhắn không hợp lệ");
            }
            console.log("tin nhắn đã gửi thành công");
        };
        socket.emit(
            "send file from client to server",
            messageText,
            files[0].name,
            acknowledgements
        );
    });
});

socket.on("send file from server to client", (message) => {
    const { createAt, messageText, username, imageName } = message;
    if (username !== params.username) {
        showImageOfOthers(username, createAt, messageText, imageName)
    } else {
        showImageOfSender(username, createAt, messageText, imageName)
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input-video');
    const customButton = document.getElementById('btn-send-video');

    customButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;

        const messageText = document.getElementById("input-messages").value;
        const formData = new FormData(); // Create a new FormData object
        formData.append("video", files[0]);
        // Make a POST request to the API
        fetch("http://localhost:4000/upload/video", {
            method: "POST",
            body: formData,
        })
        const acknowledgements = (errors) => {
            if (errors) {
                return alert("tin nhắn không hợp lệ");
            }
            console.log("tin nhắn đã gửi thành công");
        };
        socket.emit(
            "send video from client to server",
            messageText,
            files[0].name,
            acknowledgements
        );
    });
});

socket.on("send video from server to client", (message) => {
    const { createAt, messageText, username, imageName } = message;
    if (username !== params.username) {
        showVideoOfOthers(username, createAt, messageText, imageName)
    } else {
        showVideoOfSender(username, createAt, messageText, imageName)
    }
});

// nhận user list và hiển thị lên màn hình
socket.on("send user list from server to client", (userList) => {
    console.log(userList)
    let content = `
    <div class="px-4 d-none d-md-block">
                              <div class="d-flex align-items-center">
                                  <div class="flex-grow-1">
                                      <input type="text" class="form-control my-3" placeholder="Search...">
                                  </div>
                              </div>
                          </div>
    `;
    userList.map((user) => {
        content += `
        <a href="#" class="list-group-item list-group-item-action border-0">
                              <div class="badge bg-success float-right">5</div>
                              <div class="d-flex align-items-start">
                                  <img src="https://bootdey.com/img/Content/avatar/avatar5.png"
                                      class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">
                                  <div class="flex-grow-1 ml-3">
                                      ${user.username}
                                      <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
                                  </div>
                              </div>
                          </a>
      `;
    })
    document.getElementById("userList").innerHTML = content;
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

// show img của nguoi gui
const showImageOfSender = (username, createAt, messageText, fileName) => {
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
                                        <img src="http://localhost:4000/uploads/images/${fileName}" />
                                        <p>${messageText}</p>
                                    </div>
                                </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

const showImageOfOthers = (username, createAt, messageText, fileName) => {
    const contentHtml = document.getElementById("app__messages").innerHTML;
    console.log(fileName);
    const messageElement = `
    <div class="chat-message-left mb-4">
    <div>
      <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
        class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
          <div class="text-muted small text-nowrap mt-2">${createAt}</div>
                                    </div>
                                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                        <div class="font-weight-bold mb-1">${username}</div>
                                        <img src="http://localhost:4000/uploads/images/${fileName}" />
                                        <p>${messageText}</p>
                                    </div>
                                </div>
  `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

// video

const showVideoOfSender = (username, createAt, messageText, fileName) => {
    console.log(fileName);
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
                                        <video width="320" height="240" controls>
              <source src="http://localhost:4000/uploads/videos/${fileName}" type="video/mp4">
            </video>
                                        <p>${messageText}</p>
                                    </div>
                                </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

const showVideoOfOthers = (username, createAt, messageText, fileName) => {
    console.log(fileName);
    const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="chat-message-left mb-4">
    <div>
      <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
        class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
          <div class="text-muted small text-nowrap mt-2">${createAt}</div>
                                    </div>
                                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                        <div class="font-weight-bold mb-1">${username}</div>
                                        <video width="320" height="240" controls>
              <source src="http://localhost:4000/uploads/videos/${fileName}" type="video/mp4">
            </video>
                                        <p>${messageText}</p>
                                    </div>
                                </div>
    `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}