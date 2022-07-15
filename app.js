const express=require('express')
const cors=require('cors')
var app = express()

//Importaciones Rutas
const UsuarioRutas = require("./src/routes/usuario.routes");
const ProfesorRutas = require('./src/routes/profesor.routes');
const CursosRutas=require("./src/routes/cursos.routes")

//Middlewares -> INTERMEDIARIOS 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras 
app.use(cors());

//Carga de rutas
app.use('/api', UsuarioRutas,ProfesorRutas, CursosRutas);

module.exports = app;