import { collection, addDoc, getDoc, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function setRoom(roomID) {
    try {
        await setDoc(doc(db, roomID, "game"), {
            status: "pending",
            phase: 0,
            players: 0,
        });
    } catch (e) {
        console.error("Error setting room: ", e);
    }
}

export async function pushPlayer(userID, isHost, userName, roomID) {
    const docRef = doc(db, roomID, "game");
    const docSnap = await getDoc(docRef);
    try {
        const playerCount = docSnap.data().players + 1;
        if (playerCount < 5) {
            await setDoc(doc(db, roomID, `player${playerCount}`), {
                id: userID,
                name: userName,
                isHost: isHost,
                turn: 0,
                pv: 0,
                ressources: [
                    {
                        current: 0,
                        wood: 0,
                        clay: 0,
                        wheat: 0,
                        sheep: 0,
                        rock: 0,
                    },
                ],
                currentRoads: 0,
                devCards: [
                    {
                        current: 0,
                        plus: 0,
                        knights: 0,
                        twoRoads: 0,
                        discovery: 0,
                        monopole: 0,
                    },
                ],
                bonus: [
                    {
                        longestRoad: false,
                        powerfulArmy: false,
                    },
                ],
                currentKnights: 0,
                availableBuilds: [
                    {
                        roads: 15,
                        colonies: 5,
                        towns: 4,
                    },
                ],
            });
            await updateDoc(docRef, {
                players: playerCount,
            });
        } else {
            console.log("Max players limit reached!");
        }
    } catch (e) {
        console.error("Error adding player: ", e);
    }
}

export function pushData(data, type) {
    switch (type) {
        case "diceRollEvents": {
            data.forEach(async (element) => {
                try {
                    await addDoc(collection(db, "diceRollEvents"), {
                        number: element.number,
                        events: element.events,
                    });
                } catch (e) {
                    console.error("Error adding dice roll event: ", e);
                }
            });
            break;
        }
        case "roadSpotsAttributes": {
            data.forEach(async (element) => {
                try {
                    await addDoc(collection(db, "roadSpotsAttributes"), {
                        id: element.id,
                        owner: element.owner,
                        built: element.built,
                    });
                } catch (e) {
                    console.error("Error adding road spot attribute: ", e);
                }
            });
            break;
        }
        case "citySpotsAttributes": {
            data.forEach(async (element) => {
                try {
                    await addDoc(collection(db, "citySpotsAttributes"), {
                        id: `spot${element.id}`, // spot id
                        numbers: element.numbers, // numbers associated
                        wheat: element.ressources[0], // qty
                        clay: element.ressources[1], // qty
                        rock: element.ressources[2], // qty
                        wood: element.ressources[3], // qty
                        sheep: element.ressources[4], // qty
                        trade: element.trade, // name of the trade
                        owner: "none",
                        building: "none",
                    });
                } catch (e) {
                    console.error("Error adding city spot attribute: ", e);
                }
            });
            break;
        }
        default:
            console.log("ERROR: Invalid 'type' argument on pushData().");
            break;
    }
}

export async function getData(type) {
    let dataList = [];
    const dataListName = type;
    switch (type) {
        case "diceRollEvents": {
            const querySnapshot = await getDocs(collection(db, "diceRollEvents"));
            querySnapshot.forEach((doc) => {
                const rawEvent = doc.data();
                const event = {
                    number: rawEvent.number,
                    events: rawEvent.events,
                };
                dataList.push(event);
            });
            break;
        }
        case "roadSpotsAttributes": {
            const querySnapshot = await getDocs(collection(db, "roadSpotsAttributes"));
            querySnapshot.forEach((doc) => {
                const rawRoadSpot = doc.data();
                const roadSpot = {
                    id: rawRoadSpot.id,
                    owner: rawRoadSpot.owner,
                    built: rawRoadSpot.built,
                };
                dataList.push(roadSpot);
            });
            break;
        }
        case "citySpotsAttributes": {
            const querySnapshot = await getDocs(collection(db, "citySpotsAttributes"));
            querySnapshot.forEach((doc) => {
                const rawCitySpot = doc.data();
                const citySpot = {
                    id: rawCitySpot.id, // spot id
                    numbers: rawCitySpot.numbers, // numbers associated
                    wheat: rawCitySpot.wheat, // qty
                    clay: rawCitySpot.clay, // qty
                    rock: rawCitySpot.rock, // qty
                    wood: rawCitySpot.wood, // qty
                    sheep: rawCitySpot.sheep, // qty
                    trade: rawCitySpot.trade, // name of the trade
                    owner: rawCitySpot.owner,
                    building: rawCitySpot.building,
                };
                dataList.push(citySpot);
            });
            break;
        }
        default:
            console.log("ERROR: Invalid 'type' argument on getData().");
            break;
    }
    console.log(`${dataListName}: `);
    console.log(dataList);
}
