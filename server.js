// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

// Importar las librerías necesarias
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Crear una instancia de Express
const app = express();

// Middleware para analizar los cuerpos de las solicitudes (requests) como JSON
app.use(bodyParser.json());

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

// Definir un esquema para almacenar los resultados del formulario
const resultadoSchema = new mongoose.Schema({
  nombre: String,
  grupo: String,
  calificacion: Number,
});

// Crear un modelo basado en el esquema
const Resultado = mongoose.model("Resultado", resultadoSchema);

// Ruta para recibir los datos del formulario
app.post("/submit", (req, res) => {
  const { nombre, grupo, calificacion } = req.body;

  // Crear una nueva instancia de Resultado y guardarla en la base de datos
  const nuevoResultado = new Resultado({
    nombre,
    grupo,
    calificacion,
  });

  nuevoResultado
    .save()
    .then(() => res.status(200).send("Datos enviados correctamente"))
    .catch((err) => res.status(500).send("Error al guardar los datos"));
});

// Ruta para obtener todos los resultados almacenados (opcional)
app.get("/results", (req, res) => {
  Resultado.find()
    .then((resultados) => res.json(resultados))
    .catch((err) => res.status(500).send("Error al obtener los resultados"));
});

// Configuración del puerto donde escuchará el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
