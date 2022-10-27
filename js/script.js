// setting up Global Variables
const overlay = document.getElementById("overlay");

function showUserList() {
    overlay.classList.remove("hidden")
}

function hideUserList() {
    overlay.classList.add("hidden")
}



let msgArray;

const messageList = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
messageList.then(invokeMsgList);

function invokeMsgList(target) {
    const chatBox = document.querySelector(".chat-container");
    console.log(target.data);
    msgArray = target.data;

    for(let i = 0; i < msgArray.length; i++) {
        if(msgArray[i].type === "status") {
            chatBox.innerHTML += `
            <span class="msg entry"><time>${msgArray[i].time}</time> <strong>${msgArray[i].from}</strong> ${msgArray[i].text}</span>
            `
        }
        else if(msgArray[i].type === "message") {
            chatBox.innerHTML += `
            <span class="msg default"><time>${msgArray[i].time}</time> <strong>${msgArray[i].from}</strong> para <strong>${msgArray[i].to}</strong>: ${msgArray[i].text}</span>
            `
        }
        else {
            chatBox.innerHTML += `
            <span class="msg private"><time>${msgArray[i].time}</time> <strong>${msgArray[i].from}</strong> <em>reservadamente para</em> <strong>${msgArray[i].to}</strong>: ${msgArray[i].text}</span>
            `
        }
    }
}