import { ref, set, push, child, onChildAdded } from "firebase/database";
import { db } from "./firebase";

const userInput = prompt("Enter your name");
const trimmedInput = userInput?.trim();
const userName = trimmedInput && trimmedInput !== "" ? trimmedInput : "Anonyme";

const pseudoDisplay = document.getElementById("pseudo-display");

const chatArea = document.getElementById("chatArea");

const message = document.getElementById("message");

const submit = document.getElementById("submit");

const newMsg = ref(db, "messages/");

let messageTimestamps = [];

pseudoDisplay.textContent = userName;

onChildAdded(newMsg, (data) => {
    displayMessages(data);
    scrollToBottom();
});

submit.addEventListener("click", () => {
    if (message.value.trim() !== "") {
        sendMessage();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && message.value.trim() !== "") {
        sendMessage();
    }
});

function displayMessages(data) {
    if (data.val().name === userName) {
        generateMessage(data, "user-msg");
    } else {
        generateMessage(data, "buddy-msg");
    }
}

function generateMessage(data, author) {
    let sender = document.createElement("span");
    sender.textContent = `${data.val().name} - ${data.val().time}`;
    sender.classList.add("sender");
    let content = document.createElement("p");
    content.textContent = data.val().message;
    let div = document.createElement("div");
    div.classList.add(author);
    div.appendChild(content);
    div.appendChild(sender);
    chatArea.appendChild(div);
}

function sendMessage() {
    if (spamCheck()) {
        const id = push(child(ref(db), "messages")).key;
        const formatedTime = getTime();
        set(ref(db, "messages/" + id), {
            name: userName,
            message: message.value,
            time: formatedTime,
        });

        message.value = "";

        // console.log("message sent");
    }
}

function spamCheck() {
    const currentTime = Date.now();
    const messageLimitInterval = 3000; // 3 seconds
    const messageLimitCount = 3; // 3 messages

    // Removes timestamps older than 3 seconds
    messageTimestamps = messageTimestamps.filter((timestamp) => currentTime - timestamp < messageLimitInterval);

    // Check if the user has sent more than 3 messages within the last 3 seconds
    if (messageTimestamps.length >= messageLimitCount) {
        // console.log("You are sending messages too quickly. Please wait a moment before sending another message.");
        alert("Vous envoyez vos messages trop vite saltimbanque!  Ralentissez!!!");
        return false;
    }

    // Add the current timestamp to the array
    messageTimestamps.push(currentTime);
    return true;
}

function getTime() {
    const time = new Date();
    const hour = formatTimeValue(time.getHours(), "hour");
    const minutes = formatTimeValue(time.getMinutes(), "minutes");
    const date = formatTimeValue(time.getDate(), "date");
    const month = formatTimeValue(time.getMonth() + 1, "month");
    const year = time.getFullYear();

    const formatedTime = `${hour}h${minutes} - ${date}/${month}/${year}`;

    return formatedTime;
}

function formatTimeValue(value, debug) {
    let result;
    switch (true) {
        case value >= 0 && value <= 9:
            result = `0${value}`;
            break;
        case value >= 10:
            result = value;
            break;
        default:
            result = "??";
            console.log(`Failed to set ${debug}`);
    }
    return result;
}

function scrollToBottom() {
    const chatArea = document.getElementById("chatArea");
    chatArea.scrollTop = chatArea.scrollHeight;
}
