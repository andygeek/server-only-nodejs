const http = require("http");
const url = require("url");
var config = require("./config");
var _data = require("./lib/data");
var handlers = require("./lib/handlers");

/* Cread File
_data.create("test", "newFile", {"foo":"bar"}, function (err) {
  console.log("Este fue el error", err);  
})
 */

/* Read File
_data.read("test", "newFile", function (err, data) {
  console.log("Este fue el error", err, "y estos son los datos", data);  
})
 */

/* Update File
_data.update("test", "newFile", {"name":"andygeek"}, function (err) {
  console.log("Este fue el error", err);  
})
 */

// Delete File
_data.delete("test", "newFile", function (err) {
  console.log("Este fue el error", err);
});

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
      //res.setHeader("Content-Type","application/json")
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning the response of ", statusCode, payloadString);
    });
  });
});

server.listen(config.port, function () {
  console.log(`Server runing in port ${config.port}`);
});

// Definimos las rutas y el método asociadas a ellas
var router = {
  ping: handlers.ping,
  sample: handlers.sample,
};
