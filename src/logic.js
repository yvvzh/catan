const grid = document.querySelector(".grid-container");

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

const tokens = ["5", "2", "6", "3", "8", "10", "9", "12", "11", "4", "8", "10", "9", "4", "5", "6", "3", "11"];

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

boardInit();

function boardInit() {
    let tokensIndex = 0;
    for (let i = 0; i < pattern.length; i++) {
        const tile = document.createElement("div");
        tile.classList.add("hex");
        const asset = document.createElement("img");
        const assetLink = assetSelector(i);
        asset.src = assetLink;
        tile.appendChild(asset);

        if (pattern[i] === "random") {
            const token = document.createElement("div");
            token.classList.add("token");
            if (!assetLink.includes("desert")) {
                const number = document.createElement("div");
                number.classList.add("number");
                number.textContent = tokens[tokensIndex];
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
            const ratio = document.createElement("div");
            ratio.textContent = `${trades[tradeIndex].ratio} : 1`;
            token.appendChild(ratio);
            tile.appendChild(token);
        }
        grid.appendChild(tile);
    }
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
