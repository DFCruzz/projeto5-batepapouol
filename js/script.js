// setting up Global Variables
const overlay = document.getElementById("overlay");
const allUsers = document.querySelectorAll(".unq-user");
let msgData;
let particList;
let getUserName = {name: ""}
let selectedUser = "Todos";
let userMsg;
let selectedMsgType = "message"; 


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
    getUserName.name = document.querySelector(".entry-box").value
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", getUserName)
    promisse.then(joinSuccesful)
    promisse.catch(dataRetrieveError)
    retrieveMsgList()
    retrieveParticipantsList()
    userActive()  
}

function joinSuccesful() {
    const entryScreen = document.querySelector(".entry-screen")
    alert(`Seja Bem vindo(a) ${getUserName.name}!`)

    entryScreen.classList.add("hidden")
}

function userActive() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", getUserName)
    

    setTimeout(userActive, 5000)  
}

function showUserList() {
    overlay.classList.remove("hidden")
}

function hideUserList(event) {
    if(event.target.id === "overlay") {
        overlay.classList.add("hidden")
    }
}

function dataRetrieveError() {
    alert("Erro ao se conectar com o servidor! Por Favor, Recarregue a página")
    window.location.reload()
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
        const hiddenPrivateMsg = (`<span class="msg private hidden"><time>${msgData[i].time}</time> <strong>${msgData[i].from}</strong> <em>reservadamente para</em> <strong>${msgData[i].to}</strong>: ${msgData[i].text}</span>`);

        if(msgData[i].type === "status") {
            chatBox.innerHTML += statusMsg
        }
        else if(msgData[i].type === "message") {
            chatBox.innerHTML += defaultMsg
        }
        else {
            if(msgData[i].to === getUserName.name && msgData[i].from === selectedUser || msgData[i].to === selectedUser && msgData[i].from === getUserName.name) {
                chatBox.innerHTML += privateMsg 
            }
            else {
                chatBox.innerHTML += hiddenPrivateMsg 
            }
        }
    }
    const autoScroll = document.querySelector(".msg:last-child")
    autoScroll.scrollIntoView();
}

function retrieveParticipants(target) {
    const userList = document.querySelector(".user-list");
    console.log(target.data);
    particList = target.data;
    userList.innerHTML = `<div onclick="selectUser(this)" class="unq-user"><i style="margin-right: 7px;" class="fa-solid fa-user-group"></i><p>Todos</p></div>`;
    
    for(let i = 0; i < particList.length; i++){
        const userId = (`<div data-identifier="participant" onclick="selectUser(this)" class="unq-user"><i class="fa-solid fa-circle-user"></i><p>${particList[i].name}</p></div>`);

        userList.innerHTML += userId
    }
}

function selectUser(target) {
    const prevUserSelection = document.querySelector(".unq-user .selected")

    if(prevUserSelection !== null) {
        prevUserSelection.classList.remove("selected");
    }
    target.classList.add("selected")

    selectedUser = target.querySelector("p").innerHTML

    console.log(selectedUser)
}

function setPublic() {
    const publicMsg = document.getElementById("public");
    const privateMsg = document.getElementById("private");

    privateMsg.classList.remove("selected");
    publicMsg.classList.add("selected");

    selectedMsgType = "message"
    console.log(selectedMsgType);
}

function sePrivate() {
    const publicMsg = document.getElementById("public");
    const privateMsg = document.getElementById("private");

    publicMsg.classList.remove("selected");
    privateMsg.classList.add("selected");

    selectedMsgType = "private_message"
    console.log(selectedMsgType);
}

function sendMsg() {
    userMsg = document.querySelector(".input-box").value

    let postMsg = {
        from: getUserName.name,
        to: selectedUser,
        text: userMsg,
        type: selectedMsgType,
    }

    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", postMsg);
    promisse.then(msgSent);
    promisse.catch(dataRetrieveError);
}

function msgSent() {
    retrieveMsgList();
    let inputBox = document.querySelector(".input-box");
    inputBox.value = ""
}

const inputBox = document.querySelector(".input-box")
inputBox.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        sendMsg()
    }
})