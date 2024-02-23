import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import * as firebaseAuth from "./firebase.js";
import * as dbManips from "./dbManips.js";

const provider = new GoogleAuthProvider();

let userID = "";
let isHost = false;
let roomID = "";

onAuthStateChanged(firebaseAuth.auth, (user) => {
    if (user) {
        updateUserProfile(user);
        const uid = user.uid;
        userID = uid;
        return uid;
    }
});

if (document.getElementById("googleLoginBtn")) {
    const googleLogin = document.getElementById("googleLoginBtn");
    googleLogin.addEventListener("click", loginEvent);
}

if (document.getElementById("joinRoomBtn")) {
    const roomBtn = document.getElementById("joinRoomBtn");
    roomBtn.addEventListener("click", joinRoom);
}

if (document.getElementById("newRoomBtn")) {
    const roomBtn = document.getElementById("newRoomBtn");
    roomBtn.addEventListener("click", createRoom);
}

function loginEvent() {
    signInWithPopup(firebaseAuth.auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            window.location.href = "./logged.html";
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

function updateUserProfile(user) {
    const userName = user.displayName;

    document.getElementById("googleUserName").textContent = userName;
}

async function joinRoom() {
    const userName = document.getElementById("googleUserName").textContent;
    roomID = document.getElementById("joinRoomInput").value;
    await dbManips.pushPlayer(userID, isHost, userName, roomID);
    window.location.href = "./waitingRoom.html";
}

function createRoom() {
    roomID = generateRoomID();
    document.getElementById("generatedID").textContent = roomID;
    document.querySelector(".generated").removeAttribute("hidden");
    document.querySelector(".createRoom").setAttribute("hidden", true);
    isHost = true;
    document.getElementById("joinRoomInput").value = roomID;
    dbManips.setRoom(roomID);
}

function generateRoomID() {
    const charList = ["a", "b", "c", "d", "e", "A", "B", "C", "D", "E", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charList.length);
        roomID += charList[randomIndex];
    }

    return roomID;
}
