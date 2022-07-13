const express = require('express');
const alumnoController = require('../controllers/usuarios.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/registrarAlumno', alumnoController.registrarAlumno);
api.post('/login', alumnoController.login);
api.put('/editarAlumno/:idAlumno', md_autenticacion.Auth, alumnoController.editarAlumno);
api.delete('/eliminarAlumno/:idAlumno', md_autenticacion.Auth, alumnoController.eliminarAlumno);
api.get('/buscarAlumno', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], alumnoController.buscarAlumno);
api.get('/buscarAlumnoID/:idAlumno', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], alumnoController.buscarAlumnoID);

module.exports = api;