const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    plugins: [new Dotenv()],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public"),
    },
};
