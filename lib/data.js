var fs = require("fs");
var path = require("path");

// Contenedor del modulo que exportaremos
var lib = {};

// Directorio base del folder
lib.baseDir = path.join(__dirname, "./../data/");

//Abre el archivo para escribirlo
lib.create = function (dir, file, data, callback) {
  fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      //Convirte datos a string
      var stringData = JSON.stringify(data);
      // Escribe el archivo y lo cierra
      fs.writeFile(fileDescriptor, stringData, function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error al cerrar el archivo");
            }
          });
        } else {
          callback("Error al abrir el archivo");
        }
      });
    } else {
      callback("No se pudo crear el archivo " + err);
    }
  });
};

// Función para abrir archivos
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf-8", function (
    err,
    data
  ) {
    callback(err, data);
  });
};

// Funcion para actualizar datos de un archivo
lib.update = function (dir, file, data, callback) {
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      var stringData = JSON.stringify(data);

      // Truncar el archivo significa eliminar el contenido sin necesidad de borrar el archivo
      fs.ftruncate(fileDescriptor, function (err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error cerrando el archivo");
                }
              });
            } else {
              callback("Error escribiendo el archivo existente");
            }
          });
        } else {
          callback("Error truncando el archivo");
        }
      });
    } else {
      callback("No se pudo abrir el archivo quizas no exista");
    }
  });
};

lib.delete = function (dir, file, callback) {
  // Nos desenlazamos de un archivo
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
    if (!err) {
      callback(false);
    } else {
      callback("Error eliminando el archivo");
    }
  });
};

module.exports = lib;
