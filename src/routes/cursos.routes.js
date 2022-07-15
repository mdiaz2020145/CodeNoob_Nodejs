const express = require('express');
const cursoController = require('../controllers/cursos.controller')

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarCurso',md_autenticacion.Auth, cursoController.agregarCurso);
api.put('/editarCurso/:idCurso',[md_autenticacion.Auth],cursoController.editarCurso);
api.delete('/eliminarCurso/:idCurso',[md_autenticacion.Auth],cursoController.eliminarCurso);
api.get('/buscarCursos',cursoController.buscarCursos); 
api.get('/buscarCursoId/:idCurso',[md_autenticacion.Auth],cursoController.buscarCursoId);

module.exports = api;