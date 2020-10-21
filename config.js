var enviroments = {};

enviroments.staging = {
  port: 3000,
  envName: "develop",
};

enviroments.production = {
  port: 5000,
  envName: "production",
};

var currentEnviroment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

var enviromentToExport =
  typeof enviroments[currentEnviroment] == "object"
    ? enviroments[currentEnviroment]
    : enviroments.develop;


module.exports = enviromentToExport;