const Cuestionario = require('../models/cuestionario.model')
const Cursos = require('../models/cursos.model')
const underscore = require('underscore')

// TODO: hacer un crear cuestionario
function crearCuestionario(req, res) {
    let params = req.body;
    if (params.nombreCuestionario && params.numeroLeccion && params.nombreCurso) {
        Cuestionario.findOne({ nombreCuestionario: params.nombreCuestionario }, (err, cuestionarioEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
            if (underscore.isEmpty(cuestionarioEncontrado)) {
                console.log("nobre curso " + params.nombreCurso)
                Cursos.findOne({ nombreCurso: params.nombreCurso }, (err, cursoEncontrado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                    console.log(cursoEncontrado)
                    if (!cursoEncontrado) return res.status(404).send({ mensaje: 'Curso no encontrado' })
                    let cursoModel = Cuestionario();
                    cursoModel.nombreCuestionario = params.nombreCuestionario;
                    cursoModel.numeroLeccion = params.numeroLeccion;
                    cursoModel.total = 0;
                    cursoModel.idProfesor = req.user.sub;
                    cursoModel.idCurso = cursoEncontrado._id;

                    cursoModel.save((err, cuestionarioGuardado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                        if (!cuestionarioGuardado) return res.status(404).send({ mensaje: 'No se guardo el cuestionario' })
                        return res.status(200).send({ mensaje: 'Se ha guardado correctamente', cuestionario: cuestionarioGuardado })
                    })
                })
            } else {
                return res.status(500).send({ mensaje: "Ya existe ese cuestionario con ese nombre" })
            }
        })
    } else {
        return res.status(404).send({ mensaje: "No has llenado todos los datos" })
    }
}

// TODO: hacer un eliminar cuestionario

function eliminarCuestionario(req, res) {
    let idCuestinario = req.params.idCuestionario
    Cuestionario.findByIdAndDelete(idCuestinario, (err, cuestionarioEliminado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
        if (!cuestionarioEliminado) return res.status(404).send({ mensaje: 'No se elimino el cuestionario' })

        return res.status(200).send({ mensaje: 'Se ha eliminado con exito', cuestionario: cuestionarioEliminado })
    })
}

// TODO: hacer un editar cuestionario
function editarCuestionario(req, res) {
    let params = req.body;
    let idCuestinario = req.params.idCuestionario
    console.log(params.nombreCuestionario)
    if (params.nombreCuestionario) {
        Cuestionario.findByIdAndUpdate(idCuestinario, params, { new: true }, (err, cuestionarioEditado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
            if (!cuestionarioEditado) return res.status(404).send({ mensaje: 'No se editado el cuestionario' })

            return res.status(200).send({ mensaje: 'Se ha editado con exito', cuestionario: cuestionarioEditado })
        })
    } else {
        return res.status(404).send({ mensaje: "No has llenado todos los datos" })
    }
}

// TODO: hcer un agregar respuestas

function agregarRespuestas(req, res) {
    let params = req.body;
    let idCuestionario = req.params.idCuestionario
    if (params.pregunta && params.respuesta && params.puntosPregunta) {
        Cuestionario.findOne({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.pregunta } } },
            (err, preguntaBuscada) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                console.log('pregunta encontrada' + preguntaBuscada)
                if (underscore.isEmpty(preguntaBuscada)) {
                    Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub }, {
                        $push: {
                            items: {
                                pregunta: params.pregunta,
                                respuesta: params.respuesta, puntosPregunta: params.puntosPregunta
                            }
                        }
                    }, { new: true },
                        (err, preguntaAgregada) => {
                            console.log(preguntaAgregada)
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!preguntaAgregada) return res.status(404).send({ mensaje: 'No se ha podido agregar su pregunta.' })
                            Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub }, { $inc: { total: params.puntosPregunta } }, { new: true }, (err, datosIncrementados) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "" + err });
                                if (!datosIncrementados) return res.status(404).send({ mensaje: 'No se agregado su pregunta el cuestionario' })
                                return res.status(200).send({ mensaje: 'Se agregado correctamente', cuestionario: datosIncrementados })
                            })
                        })
                } else {
                    return res.status(404).send({ mensaje: "Ya posees una pregunta asi" })
                }
            })
    } else {
        return res.status(404).send({ mensaje: "No has llenado todos los datos" })
    }
}

// TODO: hcer un eliminar respuestas

function eliminarRespuestas(req, res) {
    let params = req.body;
    let cantidadRestar = 0;
    console.log(params)
    let idCuestionario = req.params.idCuestionario
    if (params.pregunta) {
        Cuestionario.findOne({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.pregunta } } },
            (err, preguntaBuscada) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "1 " + err });
                if (preguntaBuscada) {
                    console.log("pregunta buscada" + preguntaBuscada)
                    console.log("pregunta pregunta" + params.pregunta)
                    for (let i = 0; i < preguntaBuscada.items.length; i++) {
                        console.log("preguntaBuscada.items[i].pregunta" + preguntaBuscada.items[i].pregunta)
                        if (preguntaBuscada.items[i].pregunta === params.pregunta) {
                            cantidadRestar = preguntaBuscada.items[i].puntosPregunta
                        }
                    }
                    Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.pregunta } } },
                        { $pull: { items: { pregunta: params.pregunta } } },
                        (err, preguntaEliminada) => {
                            console.log("preguntaEliminada" + preguntaEliminada)
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "2 " + err });
                            if (!preguntaEliminada) return res.status(404).send({ mensaje: 'No se ha podido eliminar su pregunta.' })
                            Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub },
                                { $inc: { total: (cantidadRestar * -1) } }, (err, dismucionEliminado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!dismucionEliminado) return res.status(404).send({ mensaje: 'Error al disminuir la cantidad' })
                                    return res.status(200).send({ mensaje: 'Se agregado correctamente', cuestionario: preguntaEliminada })
                                })
                        })
                } else {
                    return res.status(404).send({ mensaje: "No posees una pregunta asi en este cuestionario" })
                }
            })
    } else {
        return res.status(404).send({ mensaje: "Debes de colocar la pregunta" })
    }

}

// TODO: hacer un editar respuestas
function editarRespuestas(req, res) {
    let params = req.body;
    let idCuestionario = req.params.idCuestionario
    let puntosPreguntaAnterior = 0;
    if (params.pregunta || params.respuesta || params.puntosPregunta) {
        Cuestionario.findOne({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.preguntaAnterior } } },
            (err, preguntaBuscada) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (preguntaBuscada) {
                    if (params.puntosPregunta) {
                        for (let i = 0; i < preguntaBuscada.items.length; i++) {
                            if (params.pregunta === preguntaBuscada.items[i].pregunta) {
                                puntosPreguntaAnterior = parseInt(preguntaBuscada.items[i].puntosPregunta) * -1;
                            }
                        }
                        console.log(puntosPreguntaAnterior)
                        Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub }, { $inc: { total: puntosPreguntaAnterior } }, { new: true }, (err, datosIncrementados) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "1 " + err });
                            if (!datosIncrementados) return res.status(404).send({ mensaje: 'No se agregado su pregunta el cuestionario' })
                            Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.preguntaAnterior } } }, {
                                "items.$.pregunta": params.pregunta, "items.$.respuesta": params.respuesta, "items.$.puntosPregunta": params.puntosPregunta
                            }, { new: true },
                                (err, preguntaAgregada) => {
                                    console.log(preguntaAgregada)
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!preguntaAgregada) return res.status(404).send({ mensaje: 'No se ha podido agregar su pregunta.' })
                                    Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub }, { $inc: { total: parseInt(params.puntosPregunta) } }, { new: true }, (err, datosIncrementados) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "2 " + err });
                                        if (!datosIncrementados) return res.status(404).send({ mensaje: 'No se agregado su pregunta el cuestionario' })
                                        return res.status(200).send({ mensaje: 'Se agregado correctamente', cuestionario: datosIncrementados })
                                    })
                                })
                        })
                    } else {
                        Cuestionario.findOneAndUpdate({ _id: idCuestionario, idProfesor: req.user.sub, items: { $elemMatch: { pregunta: params.preguntaAnterior } } }, {
                            "items.$.pregunta": params.pregunta, "items.$.respuesta": params.respuesta, "items.$.puntosPregunta": params.puntosPregunta
                        }, { new: true },
                            (err, preguntaAgregada) => {
                                console.log(preguntaAgregada)
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' + "" + err });
                                if (!preguntaAgregada) return res.status(404).send({ mensaje: 'No se ha podido agregar su pregunta.' })
                                return res.status(200).send({ mensaje: 'Se agregado correctamente', cuestionario: preguntaAgregada })
                            })
                    }
                } else {
                    return res.status(404).send({ mensaje: "No posees una pregunta asi en este cuestionario" })
                }
            })
    } else {
        return res.status(404).send({ mensaje: "No has llenado todos los campos" })
    }
}

// TODO: hacer un buscar cuestionario por el mismo id
function buscarPorId(req, res) {
    Cuestionario.find({ idProfesor: req.user.sub }, (err, cuestionarioEncontradoId) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!cuestionarioEncontradoId) return res.status(404).send({ mensaje: 'No se puede encontrar el cuestionario' })

        return res.status(200).send({ cuestionario: cuestionarioEncontradoId })
    })
}

// TODO: hacer un buscar todos los cuestinarios
function buscarTodo(req, res) {
    Cuestionario.find((err, cuestionarioEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!cuestionarioEncontrado) return res.status(404).send({ mensaje: 'No se puede encontrar el cuestionario' })

        return res.status(200).send({ cuestionario: cuestionarioEncontrado })
    })
}

function buscarSoloPorId(req, res) {
    let idCuestionario = req.params.idCuestionario
    Cuestionario.findById(idCuestionario, (err, cuestionarioEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!cuestionarioEncontrado) return res.status(404).send({ mensaje: 'No se puede encontrar el cuestionario' })

        return res.status(200).send({ cuestionario: cuestionarioEncontrado })
    })
}

function buscarPreguntas(req, res) {
    let idCuestionario = req.params.idCuestionario
    Cuestionario.findOne({ _id: idCuestionario, items: { $elemMatch: {} } }, (err, preguntasEncontradas) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        return res.status(200).send({ pregunta: preguntasEncontradas })
    })
}

function buscarPreguntaId(req, res) {
    let datosNuevos;
    let params = req.body;
    let idCuestionario = req.params.idCuestionario
    console.log(params)
    Cuestionario.findOne({ _id: idCuestionario, items: { $elemMatch: { _id: params._id, pregunta: params.pregunta } } }, (err, preguntasEncontradas) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        // if (!preguntasEncontradas) return res.status(404).send({ mensaje: 'No pose preguntas aun el cuestionario' })
        for (let i = 0; i <= preguntasEncontradas.items.length; i++) {
            if (preguntasEncontradas.items[i]._id == params._id) {
                datosNuevos = preguntasEncontradas.items[i]
                return res.status(200).send({ pregunta: datosNuevos })
            }
        }
    })
}

function buscarCuestionarioCurso(req, res) {
    let idCur = req.params.idCurso;
    Cuestionario.find({ idCurso: idCur }, (err, cuestionariosEncontrados) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!cuestionariosEncontrados) return res.status(404).send({ mensaje: 'No se encontro el cuestionario' })
        return res.status(200).send({ pregunta: cuestionariosEncontrados })
    })
}

module.exports = {
    crearCuestionario,
    editarCuestionario,
    eliminarCuestionario,
    agregarRespuestas,
    editarRespuestas,
    eliminarRespuestas,
    buscarPorId,
    buscarTodo,
    buscarSoloPorId,
    buscarPreguntas,
    buscarPreguntaId,
    buscarCuestionarioCurso,
}