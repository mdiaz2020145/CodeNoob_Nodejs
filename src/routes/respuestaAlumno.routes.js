const express = require('express');
const RespuestaController = require('../controllers/respuestaAlumno.controller')

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/respuestaIngresada',md_autenticacion.Auth,RespuestaController.respuestaAlumno);

module.exports = api;