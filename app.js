const http = require("http");
const url = require("url");
const config = require("./config");

const server = http.createServer(function (req, res) {
  // Para obtener la ruta
  var parsedUrl = url.parse(req.url);
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Para obtener la cabecera
  var headers = req.headers;

  // Para obtener el método de la petición
  var method = req.method;
  // Para obtener los parámetros de la petición
  var queryString = parsedUrl.query;

  // Para obtener el cuerpo de la petición
  let body = [];

  req.on("data", function (chunk) {
    body.push(chunk);
  });

  req.on("end", function () {
    body = Buffer.concat(body).toString();

    // Definimos la variable que nos devolverá el método asociada a la ruta que ingresemos
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Este objeto almacenará los datos de la petición
    var data = {
      trimmedPath: trimmedPath,
      method: method,
      headers: headers,
      queryStringObject: queryString,
      payload: body,
    };

    // Este método administra la petición y en base al callback que tiene asociado
    // ejecuta lo necesario como la respuesta que dará o la que se mostrará en la consola
    chosenHandler(data, function (statusCode, payload) {
      statusCodde = typeof statusCode == "number" ? statusCode : {};
      var payloadString = JSON.stringify(payload);
      // Convertirá nuestro response en un objeto Json
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning the response of ", statusCode, payloadString);
    });
  });
});

server.listen(config.port, function () {
  console.log(`Server runign at http://localhost/${config.port}`);
});

// Definimos el objeto handlers que contendrá los manejadores de cada ruta
var handlers = {};

handlers.ping = function (data, callback) {
  callback(200);
};

handlers.sample = function (data, callback) {
  callback(406, { name: "sample handler" });
};

handlers.notFound = function (data, callback) {
  callback(404);
};

// Definimos las rutas y el método asociadas a ellas
var router = {
  ping: handlers.ping,
  sample: handlers.sample,
};
