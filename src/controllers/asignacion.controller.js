const Cursos = require('../models/cursos.model')
const Asignacion = require('../models/asignacion.model');

function asignarCursos(req, res) {
    const parametros = req.body;
    const alumnoLog = req.user.sub;
    const AsignacionModel = new Asignacion();
    var nombreCurso = req.params.nombreCurso

    if (nombreCurso) {
        Asignacion.find({ idAlumno: alumnoLog }).populate('idCurso').exec((err, asigancionEncontrada) => {


            for (let i = 0; i < asigancionEncontrada.length; i++) {
                if (asigancionEncontrada[i].idCurso.nombreCurso === nombreCurso) return res.status(400).send({ mensaje: 'No puede asignarse al mimso curso dos veces' })
            }

            Cursos.findOne({ nombreCurso: nombreCurso }, (err, cursoEncontrado) => {
                if (err) return res.status(400).send({ mensaje: 'Error en la peticios' })
                if (!cursoEncontrado) return res.status(400).send({ mensaje: 'Este curso, no existe' })

                AsignacionModel.idCurso = cursoEncontrado._id;
                AsignacionModel.idAlumno = alumnoLog;

                AsignacionModel.save((err, asignacionGuardada) => {
                    if (err) return res.status(400).send({ mensaje: 'Error en la peticios' })
                    if (!asignacionGuardada) return res.status(400).send({ mensaje: 'No se pudo guardar la asignacion' })

                    return res.status(200).send({ Asignacion: asignacionGuardada })
                })
            })


        })

    } else {
        return res.status(500).send({ mensaje: 'Debe enviar los parametros que se necesitan' })
    }
}

function eliminarAsignacion(req,res){
    var idAsignacion = req.params.idAsignacion

    Asignacion.findByIdAndDelete(idAsignacion,(err,asignacionEliminada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!asignacionEliminada) return res.status(404).send({ mensaje: 'Error al eliminar la asignacion' });
        return res.status(200).send({ AsignacionEliminada: asignacionEliminada })
    })


}

function buscarAsignacion(req,res){
    Asignacion.find((err,asignacionEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!asignacionEncontrada) return res.status(404).send({ mensaje: 'Error al encontrar la asignacion' });
        return res.status(200).send({ Asignacion: asignacionEncontrada })
    })
}

function buscarAsginacionId(req,res){
    var idAsignacion = req.params.idAsignacion

    Asignacion.findById(idAsignacion,(err,asignacionEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!asignacionEncontrada) return res.status(404).send({ mensaje: 'Error al encontrar la asignacion' });
        return res.status(200).send({ Asignacion: asignacionEncontrada })
    })

}

module.exports = {
    asignarCursos,
    buscarAsignacion,
    buscarAsginacionId,
    eliminarAsignacion
}