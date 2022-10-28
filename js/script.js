// setting up Global Variables
const overlay = document.getElementById("overlay");
const allUsers = document.querySelectorAll(".unq-user");
let msgData;
let particList;
let getUserName = {name: ""}
let sentUser;
let userMsg;
let msgType; 


function retrieveMsgList() {
    const messageList = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messageList.then(retrieveMsg);
    messageList.catch(dataRetrieveError);

    setTimeout(retrieveMsgList, 3000);
}

function retrieveParticipantsList() {
    const participantsList = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    participantsList.then(retrieveParticipants);
    participantsList.catch(dataRetrieveError);

    setTimeout(retrieveParticipantsList, 3000)
}

function joinChat() {
    getUserName.name = prompt("Qual o seu nome chuchu?")
    const userApi = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", getUserName)
    userApi.then(deuBom())
    userApi.catch(dataRetrieveError())
    userActive()
    
}

function userActive() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", getUserName)

    setTimeout(userActive, 5000)  
}

function showUserList() {
    overlay.classList.remove("hidden")
}

function hideUserList() {
    overlay.classList.add("hidden")
}

function dataRetrieveError() {
    alert("Erro ao se conectar com o servidor! Por Favor, Recarregue a Página")
}

function deuBom() {
    alert("deu Bom")
}

function retrieveMsg(target) {
    const chatBox = document.querySelector(".chat-container");
    console.log(target.data);
    msgData = target.data;
    chatBox.innerHTML = ""

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
    const autoScroll = document.querySelector(".msg:last-child")
    autoScroll.scrollIntoView();
}

function retrieveParticipants(target) {
    const userList = document.querySelector(".user-list");
    console.log(target.data);
    particList = target.data;
    userList.innerHTML = `<div class="unq-user"><i style="margin-right: 7px;" class="fa-solid fa-user-group"></i>Todos</div>`;
    
    for(let i = 0; i < particList.length; i++){
        const userId = (`<div class="unq-user"><i class="fa-solid fa-circle-user"></i>${particList[i].name}</div>`);

        userList.innerHTML += userId
    }
}


retrieveMsgList()
retrieveParticipantsList()
joinChat()