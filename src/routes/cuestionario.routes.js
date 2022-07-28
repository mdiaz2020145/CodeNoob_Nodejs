const express = require('express');
const CuestionarioController = require('../controllers/cuestionario.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.post('/agregarCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.crearCuestionario)
api.delete('/eliminarCuestionario/:idCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.eliminarCuestionario)
api.put('/editarCuestionario/:idCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.editarCuestionario)

api.put('/agregarPreguntas/:idCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.agregarRespuestas)
api.put('/editarPreguntas/:idCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.editarRespuestas)
api.put('/eliminarPreguntas/:idCuestionario', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.eliminarRespuestas)

api.get('/buscarPorId', [md_autenticacion.Auth, md_autenticacion_roles.verProfesor], CuestionarioController.buscarPorId)
api.get('/buscarCuestionarios', CuestionarioController.buscarTodo)
api.get('/buscarSoloPorId/:idCuestionario', CuestionarioController.buscarSoloPorId)

api.get('/preguntasEncontradas/:idCuestionario', CuestionarioController.buscarPreguntas)
api.post('/buscarPreguntaId/:idCuestionario', CuestionarioController.buscarPreguntaId)
module.exports = api;