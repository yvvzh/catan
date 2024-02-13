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

let usedWheat = 0;
let usedClay = 0;
let usedRock = 0;
let usedWood = 0;
let usedSheep = 0;
let usedDesert = 0;

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

        if ((i >= 5 && i <= 7) || (i >= 10 && i <= 13) || (i >= 16 && i <= 20) || (i >= 23 && i <= 26) || (i >= 29 && i <= 31)) {
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
            asset = tiles[generateRandom()].asset;
            break;
        default:
            console.log("assetSelector() switch case FAILED");
    }

    return asset;
}

function generateRandom() {
    const random = Math.floor(Math.random() * availableTiles.length);
    const selected = availableTiles[random];
    let assetIndex;
    switch (selected) {
        case "wheat":
            assetIndex = 2;
            usedWheat++;
            break;
        case "clay":
            assetIndex = 3;
            usedClay++;
            break;
        case "rock":
            assetIndex = 4;
            usedRock++;
            break;
        case "wood":
            assetIndex = 5;
            usedWood++;
            break;
        case "sheep":
            assetIndex = 6;
            usedSheep++;
            break;
        case "desert":
            assetIndex = 7;
            usedDesert++;
            break;
        default:
            console.log("generateRandom() switch case FAILED");
    }

    manageAvailableTiles(tiles[assetIndex].name);

    return assetIndex;
}

function manageAvailableTiles(name) {
    let elementToCheck;
    switch (name) {
        case "wheat":
            elementToCheck = usedWheat;
            break;
        case "clay":
            elementToCheck = usedClay;
            break;
        case "rock":
            elementToCheck = usedRock;
            break;
        case "wood":
            elementToCheck = usedWood;
            break;
        case "sheep":
            elementToCheck = usedSheep;
            break;
        case "desert":
            elementToCheck = usedDesert;
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
