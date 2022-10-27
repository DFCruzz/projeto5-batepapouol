// setting up Global Variables
const overlay = document.getElementById("overlay");
let sentMsg;
let msgData;
let particList;


function retrieveMsgList() {
    const messageList = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messageList.then(retrieveMsg);
    messageList.catch(dataRetrieveError);

    setTimeout(retrieveMsgList, 3000);
}

const participantsList = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
participantsList.then(retrieveParticipants);
participantsList.catch(dataRetrieveError);

function showUserList() {
    overlay.classList.remove("hidden")
}

function hideUserList() {
    overlay.classList.add("hidden")
}

function dataRetrieveError() {
    alert("Erro ao se conectar com o servidor! Por Favor, Recarregue a Página")
}



function retrieveMsg(target) {
    const chatBox = document.querySelector(".chat-container");
    console.log(target.data);
    msgData = target.data;

    for(let i = 0; i < msgData.length; i++) {
        const statusMsg = (`<span class="msg entry"><time>${msgData[i].time}</time> <strong>${msgData[i].from}</strong> ${msgData[i].text}</span>`);
        const defaultMsg = (`<span class="msg default"><time>${msgData[i].time}</time> <strong>${msgData[i].from}</strong> para <strong>${msgData[i].to}</strong>: ${msgData[i].text}</span>`);
        const privateMsg = (`<span class="msg private"><time>${msgData[i].time}</time> <strong>${msgData[i].from}</strong> <em>reservadamente para</em> <strong>${msgData[i].to}</strong>: ${msgData[i].text}</span>`);

        if(msgData[i].type === "status") {
            chatBox.innerHTML += statusMsg
        }
        else if(msgData[i].type === "message") {
            chatBox.innerHTML += defaultMsg
        }
        else {
            chatBox.innerHTML += privateMsg
        }
    }
}

function retrieveParticipants(target) {
    const userList = document.querySelector(".user-list");
    console.log(target.data);
    particList = target.data;
    
    for(let i = 0; i < particList.length; i++){
        const userId = (`<span><i class="fa-solid fa-circle-user"></i>${particList[i].name}</span>`);

        userList.innerHTML += userId
    }
}

retrieveMsgList()