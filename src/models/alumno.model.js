const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumnoSchema = Schema({
    nombreUsuario:String,
    email:String,
    password: String,
    rol:String,
    puntosTotales: Number
});

module.exports = mongoose.model('Alumnos', AlumnoSchema);