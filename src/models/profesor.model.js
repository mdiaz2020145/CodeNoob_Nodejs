const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfesorSchema = Schema({
    nombreProfe:String,
    email:String,
    password: String,
    rol:String
});

module.exports = mongoose.model('Profesores', ProfesorSchema);