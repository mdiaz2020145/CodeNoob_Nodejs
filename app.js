const express = require('express')
const cors = require('cors')
var app = express()

//Importaciones Rutas
const UsuarioRutas = require("./src/routes/usuario.routes");
const ProfesorRutas = require('./src/routes/profesor.routes');
const CursosRutas = require("./src/routes/cursos.routes")
const CuestionarioRutas = require("./src/routes/cuestionario.routes")
const AsignacionCursos = require('./src/routes/asignacion.routes')

//Middlewares -> INTERMEDIARIOS 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras 
app.use(cors());

//Carga de rutas
app.use('/api', UsuarioRutas, ProfesorRutas, CursosRutas, CuestionarioRutas,AsignacionCursos);

module.exports = app;