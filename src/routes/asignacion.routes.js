const express = require('express');
const asignacionController = require('../controllers/asignacion.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.get('/asignacionCurso/:idCurso',[md_autenticacion.Auth,md_autenticacion_roles.verAlumnos],asignacionController.asignarCursos);
api.get('/buscarAsigancion',[md_autenticacion.Auth,md_autenticacion_roles.verAlumnos],asignacionController.buscarAsignacion);
api.get('/buscarAsigancionId/:idAsignacion',[md_autenticacion.Auth,md_autenticacion_roles.verAlumnos],asignacionController.buscarAsginacionId);
api.delete('/eliminarAsignacion/:idAsignacion',[md_autenticacion.Auth,md_autenticacion_roles.verAlumnos],asignacionController.eliminarAsignacion);

module.exports = api;