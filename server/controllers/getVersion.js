const packageJson = require("../package.json");

const getVersion = async () => {
  const { version } = packageJson;
  return version;
};

module.exports = getVersion;
