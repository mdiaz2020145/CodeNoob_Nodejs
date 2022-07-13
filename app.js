const express=require('express')
const cors=require('cors')
var app = express()

//Importaciones Rutas

//Middlewares -> INTERMEDIARIOS 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras 
app.use(cors());

//Carga de rutas
//app.use('/api');

module.exports = app;