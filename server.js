require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://Noya:NotYoEA023@cluster0.e3atf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema
const resultadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  grupo: {
    type: String,
    required: true,
    trim: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 0
  },
  fechaEnvio: {
    type: Date,
    default: Date.now
  }
});

const Resultado = mongoose.model("Resultado", resultadoSchema);

// Routes
app.post("/submit", async (req, res) => {
  try {
    const { nombre, grupo, calificacion } = req.body;

    if (!nombre || !grupo || calificacion === undefined) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const nuevoResultado = new Resultado({
      nombre,
      grupo,
      calificacion
    });

    await nuevoResultado.save();
    res.status(200).json({ message: "Datos enviados correctamente" });
  } catch (error) {
    console.error("Error al guardar resultado:", error);
    res.status(500).json({ error: "Error al guardar los datos" });
  }
});

// API route to get results
app.get("/api/results", async (req, res) => {
  try {
    const resultados = await Resultado.find().sort({ fechaEnvio: -1 });
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    res.status(500).json({ error: "Error al obtener los resultados" });
  }
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});