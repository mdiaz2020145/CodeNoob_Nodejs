const express = require('express');
const profesorController = require('../controllers/profesor.controller')

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/registrarProfesor',profesorController.registrarProfesor);
api.post('/loginProfesor',profesorController.loginProfesor);
api.put('/editarProfesor/:idProfesor',[md_autenticacion.Auth],profesorController.editarProfesor);
api.delete('/eliminarProfesor/:idProfesor',[md_autenticacion.Auth],profesorController.eliminarProfesor);
api.get('/buscarProfesor' ,profesorController.buscarProfesor); 
api.get('/buscarProfesorID/:idProfesor' ,profesorController.buscarProfesorID);

module.exports = api;