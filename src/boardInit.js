const grid = document.querySelector(".grid-container");
const matrix = document.querySelector(".interactive-grid");

const tiles = [
    {
        name: "port",
        asset: "./assets/tiles/tile_port.jpg",
        quantity: 9,
        token: false,
        trade: true,
    },
    {
        name: "sea",
        asset: "./assets/tiles/tile_sea.jpg",
        quantity: 9,
        token: false,
        trade: false,
    },
    {
        name: "wheat",
        asset: "./assets/tiles/tile_wheat.jpg",
        quantity: 4,
        token: true,
        trade: false,
    },
    {
        name: "clay",
        asset: "./assets/tiles/tile_clay.jpg",
        quantity: 3,
        token: true,
        trade: false,
    },
    {
        name: "rock",
        asset: "./assets/tiles/tile_rock.jpg",
        quantity: 3,
        token: true,
        trade: false,
    },
    {
        name: "wood",
        asset: "./assets/tiles/tile_wood.jpg",
        quantity: 4,
        token: true,
        trade: false,
    },
    {
        name: "sheep",
        asset: "./assets/tiles/tile_sheep.jpg",
        quantity: 4,
        token: true,
        trade: false,
    },
    {
        name: "desert",
        asset: "./assets/tiles/tile_desert.jpg",
        quantity: 1,
        token: true,
        trade: false,
    },
];

const tokens = ["5", "2", "6", "10", "9", "4", "3", "8", "11", "5", "8", "4", "3", "6", "10", "11", "12", "9"];

const trades = [
    {
        name: "classic",
        quantity: 4,
        impact: "all",
        ratio: 3,
    },
    {
        name: "wood",
        quantity: 1,
        impact: "wood",
        ratio: 2,
    },
    {
        name: "clay",
        quantity: 1,
        impact: "clay",
        ratio: 2,
    },
    {
        name: "wheat",
        quantity: 1,
        impact: "wheat",
        ratio: 2,
    },
    {
        name: "sheep",
        quantity: 1,
        impact: "sheep",
        ratio: 2,
    },
    {
        name: "rock",
        quantity: 1,
        impact: "rock",
        ratio: 2,
    },
];

const pattern = [
    "port",
    "sea",
    "port",
    "sea",
    "sea",
    "random",
    "random",
    "random",
    "port",
    "port",
    "random",
    "random",
    "random",
    "random",
    "sea",
    "sea",
    "random",
    "random",
    "random",
    "random",
    "random",
    "port",
    "port",
    "random",
    "random",
    "random",
    "random",
    "sea",
    "sea",
    "random",
    "random",
    "random",
    "port",
    "port",
    "sea",
    "port",
    "sea",
];

let availableTiles = ["wheat", "clay", "rock", "wood", "sheep", "desert"];

let usedWheatTile = 0;
let usedClayTile = 0;
let usedRockTile = 0;
let usedWoodTile = 0;
let usedSheepTile = 0;
let usedDesertTile = 0;

let availableTrades = ["classic", "wood", "clay", "wheat", "sheep", "rock"];

let usedClassicTrade = 0;
let usedWoodTrade = 0;
let usedWheatTrade = 0;
let usedClayTrade = 0;
let usedRockTrade = 0;
let usedSheepTrade = 0;

const patternCSA = [
    [0, 3], // port 1
    [1, 5], // port 2
    [0, 3, 4, 7, 8, 12], // tile 1
    [1, 4, 5, 8, 9, 13], // tile 2
    [2, 5, 6, 9, 10, 14], // tile 3
    [6, 10], // port 3
    [11, 16], // port 4
    [7, 11, 12, 16, 17, 22], // tile 4
    [8, 12, 13, 17, 18, 23], // tile 5
    [9, 13, 14, 18, 19, 24], // tile 6
    [10, 14, 15, 19, 20, 25], // tile 7
    [16, 21, 22, 27, 28, 33], // tile 8
    [17, 22, 23, 28, 29, 34], // tile 9
    [18, 23, 24, 29, 30, 35], // tile 10
    [19, 24, 25, 30, 31, 36], // tile 11
    [20, 25, 26, 31, 32, 37], // tile 12
    [26, 32], // port 5
    [27, 23], // port 6
    [28, 33, 34, 38, 39, 43], // tile 13
    [29, 34, 35, 39, 40, 44], // tile 14
    [30, 35, 36, 40, 41, 45], // tile 15
    [31, 36, 37, 41, 42, 46], // tile 16
    [39, 43, 44, 47, 48, 51], // tile 17
    [40, 44, 45, 48, 49, 52], // tile 18
    [41, 45, 46, 49, 50, 53], // tile 19
    [46, 50], // port 7
    [47, 51], // port 8
    [49, 52], // port 9
];
let rawCSA = [];

let citySpotsAttributes = [];
let roadSpotsAttributes = [];
let usedSpots = [];

boardInit();
console.log(citySpotsAttributes);

function boardInit() {
    gridInit();
    let patternCSAindex = 0;
    let tokensIndex = 0;

    for (let i = 0; i < pattern.length; i++) {
        let currentTrade = "none";
        let currentRessource = "desert";
        let currentNumber = "none";
        let checkCSA = 0;

        const tile = document.createElement("div");
        tile.classList.add("hex");
        const asset = document.createElement("img");
        const assetLink = assetSelector(i);
        const currentRessourceIndex = tiles.findIndex(function (obj) {
            return obj["asset"] === assetLink;
        });
        currentRessource = tiles[currentRessourceIndex].name;

        asset.src = assetLink;
        tile.appendChild(asset);

        if (pattern[i] === "random") {
            const token = document.createElement("div");
            token.classList.add("token");
            if (!asset.src.includes("desert")) {
                const number = document.createElement("div");
                number.classList.add("number");
                number.textContent = tokens[tokensIndex];
                currentNumber = tokens[tokensIndex];
                token.appendChild(number);

                if (tokens[tokensIndex] === "6" || tokens[tokensIndex] === "8") {
                    token.classList.add("great-odds");
                }

                tokensIndex++;
            } else {
                token.classList.add("thieves");
                const icon = document.createElement("i");
                icon.classList.add("bx", "bx-block");
                token.appendChild(icon);
            }
            tile.appendChild(token);
        } else if (pattern[i] === "port") {
            const token = document.createElement("div");
            token.classList.add("token", "ratio");
            const tradeIndex = generateRandomTrade();
            if (tradeIndex > 0) {
                const name = document.createElement("div");
                name.textContent = trades[tradeIndex].name.toUpperCase();
                token.appendChild(name);
            }
            currentTrade = trades[tradeIndex].name;
            const ratio = document.createElement("div");
            ratio.textContent = `${trades[tradeIndex].ratio} : 1`;
            token.appendChild(ratio);
            tile.appendChild(token);
        }
        grid.appendChild(tile);

        if (currentRessource !== "port" && currentRessource !== "sea" && currentRessource !== "desert") {
            manageRawCSA("ressource", patternCSA[patternCSAindex], currentRessource);
            checkCSA++;
        } else if (currentRessource === "desert") {
            checkCSA++;
        }

        if (currentNumber !== "none") {
            manageRawCSA("number", patternCSA[patternCSAindex], currentNumber);
            checkCSA++;
        }

        if (currentTrade !== "none") {
            manageRawCSA("trade", patternCSA[patternCSAindex], currentTrade);
            checkCSA++;
        }

        if (checkCSA > 0) {
            patternCSAindex++;
        }
    }
    manageCitySpotAttributes();
}

function gridInit() {
    const tradeSpotPattern = [0, 1, 3, 5, 6, 10, 11, 16, 26, 27, 32, 33, 46, 47, 49, 50, 51, 52];
    for (let i = 0; i < 126; i++) {
        const spot = document.createElement("div");
        spot.id = `spot${i}`;
        if (i < 54) {
            spot.classList.add("spot", "citySpot");
            if (tradeSpotPattern.includes(i)) {
                spot.classList.add("tradeSpot");
            }
        } else {
            spot.classList.add("spot", "roadSpot");
            const newRoadSpot = {
                id: spot.id,
                owner: "none",
                built: false,
            };
            roadSpotsAttributes.push(newRoadSpot);
        }

        matrix.appendChild(spot);
    }
}

function manageRawCSA(type, spots, value) {
    switch (type) {
        case "trade":
            spots.forEach((spot) => {
                const spotIndex = rawCSA.findIndex(function (obj) {
                    return obj["id"] === spot;
                });
                if (spotIndex !== -1) {
                    rawCSA[spotIndex].trade = value;
                } else {
                    let newRawCSA = {
                        id: spot,
                        numbers: [],
                        ressources: [0, 0, 0, 0, 0],
                        trade: value,
                    };
                    rawCSA.push(newRawCSA);
                }
            });
            break;

        case "ressource":
            let indexToItterate;

            switch (value) {
                case "wheat":
                    indexToItterate = 0;
                    break;
                case "clay":
                    indexToItterate = 1;
                    break;
                case "rock":
                    indexToItterate = 2;
                    break;
                case "wood":
                    indexToItterate = 3;
                    break;
                case "sheep":
                    indexToItterate = 4;
                    break;
                default:
                    console.log("switch case for ressources in manageRawCSA() FAILED");
            }

            spots.forEach((spot) => {
                const spotIndex = rawCSA.findIndex(function (obj) {
                    return obj["id"] === spot;
                });
                if (spotIndex !== -1) {
                    rawCSA[spotIndex].ressources[indexToItterate]++;
                } else {
                    let newRawCSA = {
                        id: spot,
                        numbers: [],
                        ressources: [0, 0, 0, 0, 0],
                        trade: "none",
                    };
                    newRawCSA.ressources[indexToItterate]++;
                    rawCSA.push(newRawCSA);
                }
            });
            break;

        case "number":
            spots.forEach((spot) => {
                const spotIndex = rawCSA.findIndex(function (obj) {
                    return obj["id"] === spot;
                });
                if (spotIndex !== -1) {
                    rawCSA[spotIndex].numbers.push(value);
                } else {
                    let newRawCSA = {
                        id: spot,
                        numbers: [],
                        ressources: [0, 0, 0, 0, 0],
                        trade: "none",
                    };
                    newRawCSA.numbers.push(value);
                    rawCSA.push(newRawCSA);
                }
            });
            break;
        default:
            console.log("manageRawCSA() switch case FAILED");
    }
}

function manageCitySpotAttributes() {
    rawCSA.forEach((e) => {
        const newCSA = {
            id: `spot${e.id}`, // spot id
            numbers: e.numbers, // numbers associated
            wheat: e.ressources[0], // qty
            clay: e.ressources[1], // qty
            rock: e.ressources[2], // qty
            wood: e.ressources[3], // qty
            sheep: e.ressources[4], // qty
            trade: e.trade, // name of the trade
            owner: "none",
            building: "none",
        };
        citySpotsAttributes.push(newCSA);
    });
}

function assetSelector(i) {
    let asset;
    switch (pattern[i]) {
        case "port":
            asset = tiles[0].asset;
            break;
        case "sea":
            asset = tiles[1].asset;
            break;
        case "random":
            asset = tiles[generateRandomAsset()].asset;
            break;
        default:
            console.log("assetSelector() switch case FAILED");
    }

    return asset;
}

function generateRandomAsset() {
    const random = Math.floor(Math.random() * availableTiles.length);
    const selected = availableTiles[random];
    let assetIndex;
    switch (selected) {
        case "wheat":
            assetIndex = 2;
            usedWheatTile++;
            break;
        case "clay":
            assetIndex = 3;
            usedClayTile++;
            break;
        case "rock":
            assetIndex = 4;
            usedRockTile++;
            break;
        case "wood":
            assetIndex = 5;
            usedWoodTile++;
            break;
        case "sheep":
            assetIndex = 6;
            usedSheepTile++;
            break;
        case "desert":
            assetIndex = 7;
            usedDesertTile++;
            break;
        default:
            console.log("generateRandomAsset() switch case FAILED");
    }

    manageAvailableTiles(tiles[assetIndex].name);

    return assetIndex;
}

function manageAvailableTiles(name) {
    let elementToCheck;
    switch (name) {
        case "wheat":
            elementToCheck = usedWheatTile;
            break;
        case "clay":
            elementToCheck = usedClayTile;
            break;
        case "rock":
            elementToCheck = usedRockTile;
            break;
        case "wood":
            elementToCheck = usedWoodTile;
            break;
        case "sheep":
            elementToCheck = usedSheepTile;
            break;
        case "desert":
            elementToCheck = usedDesertTile;
            break;
        default:
            console.log("manageAvailableTiles() switch case FAILED");
    }
    const quantityToCheck = tiles[tiles.findIndex((tile) => tile.name === name)].quantity;

    if (elementToCheck >= quantityToCheck) {
        let indexToRemove = availableTiles.indexOf(name);
        if (indexToRemove !== -1) {
            availableTiles.splice(indexToRemove, 1);
        }
    }
}

function generateRandomTrade() {
    const random = Math.floor(Math.random() * availableTrades.length);
    const selected = availableTrades[random];
    let tradeIndex;
    switch (selected) {
        case "classic":
            tradeIndex = 0;
            usedClassicTrade++;
            break;
        case "wood":
            tradeIndex = 1;
            usedWoodTrade++;
            break;
        case "clay":
            tradeIndex = 2;
            usedClayTrade++;
            break;
        case "wheat":
            tradeIndex = 3;
            usedWheatTrade++;
            break;
        case "sheep":
            tradeIndex = 4;
            usedSheepTrade++;
            break;
        case "rock":
            tradeIndex = 5;
            usedRockTrade++;
            break;
        default:
            console.log("generateRandomTrade() switch case FAILED");
    }

    manageAvailableTrades(trades[tradeIndex].name);

    return tradeIndex;
}

function manageAvailableTrades(name) {
    let elementToCheck;
    switch (name) {
        case "wheat":
            elementToCheck = usedWheatTrade;
            break;
        case "clay":
            elementToCheck = usedClayTrade;
            break;
        case "rock":
            elementToCheck = usedRockTrade;
            break;
        case "wood":
            elementToCheck = usedWoodTrade;
            break;
        case "sheep":
            elementToCheck = usedSheepTrade;
            break;
        case "classic":
            elementToCheck = usedClassicTrade;
            break;
        default:
            console.log("manageAvailableTrades() switch case FAILED");
    }
    const quantityToCheck = trades[trades.findIndex((trade) => trade.name === name)].quantity;

    if (elementToCheck >= quantityToCheck) {
        let indexToRemove = availableTrades.indexOf(name);
        if (indexToRemove !== -1) {
            availableTrades.splice(indexToRemove, 1);
        }
    }
}
