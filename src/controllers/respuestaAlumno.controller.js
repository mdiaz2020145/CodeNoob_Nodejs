const Cuestionario = require('../models/cuestionario.model')
const Cursos = require('../models/cursos.model')
const Respuesta = require('../models/respuestaAlumno.model')


function respuestaAlumno(req,res){
    const parametros = req.body;
    const alumnoLog = req.user.sub;
    const RespuestaModel = new Respuesta();
    
    if(parametros.respuesta){
        Respuesta.find({idAlumno: alumnoLog}).populate('idCuestionario').exec((err,respuestaEncontrada)=>{
            for(let i=0; i <respuestaEncontrada.length; i++){
                if(respuestaEncontrada[i].idCuestionario.respuesta == parametros.respuesta) return res.status(400).send({mensaje:'A'})
            }

            Cuestionario.findOne({respuesta:parametros.respuesta},(err,cuestionarioEncontrado)=>{
                if (err) return res.status(400).send({ mensaje: 'Error en la peticion' })
                if (!cuestionarioEncontrado) return res.status(400).send({ mensaje: 'Esta respuesta, no existe' })

                RespuestaModel.respuesta = parametros.respuesta;
                RespuestaModel.idCuestionario = cuestionarioEncontrado._id;
                RespuestaModel.idAlumno = alumnoLog;

                RespuestaModel.save((err,respuestaAlumnoGuardada)=>{
                    if (err) return res.status(400).send({ mensaje: 'Error en la peticion' })
                    if (!respuestaAlumnoGuardada) return res.status(400).send({ mensaje: 'No se pudo guardar' })
                    return res.status(200).send({respesta:respuestaAlumnoGuardada})
                })
            })



        })

    }else{
        return res.status(500).send({mensaje:'Debe enviar las respuestas'})
    }

    


}




module.exports = {
    respuestaAlumno
}