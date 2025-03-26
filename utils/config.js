const fs = require("fs/promises");
const path = require("path");

const getNetworkConfig = async (network) => {
    const configPath = path.join(__dirname, "../config/networks.json");
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData)[network];
};

module.exports = { getNetworkConfig };
