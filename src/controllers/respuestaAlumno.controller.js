const Cuestionario = require('../models/cuestionario.model')
const Cursos = require('../models/cursos.model')
const Respuesta = require('../models/respuestaAlumno.model')
const underscore= require('underscore')


function respuestaAlumno(req,res){
    var idCuestionario=req.params.idCuestionario
    var parametros = req.body;
    const alumnoLog = req.user.sub;
    var RespuestaModel = new Respuesta();
    var respuestaAlumno;
    let notaTotal=0;
    
    if(!underscore.isEmpty(parametros.respuestas)){
        Cuestionario.findOne({idCuestionario:idCuestionario},(err, cuestionarioEncontrado)=>{
            if(!underscore.isEmpty(cuestionarioEncontrado)){
                cuestionarioEncontrado.items.forEach(preguntasCuestionario=>{

                    if(!underscore.isEmpty(preguntasCuestionario)){

                        for(let i=0; i<parametros.respuestas.lenght; i++){
                            if(preguntasCuestionario.repuesta===parametros.respuestas[i].toString()){
                                //Se guarda lo que se envia de angular
                                respuestaAlumno=[{ respuesta: parametros.respuestas[i].toString(), calificacion: parseInt(preguntasCuestionario.puntosPregunta)}]
                                
                            }
                        }

                    }else{
                        return res.status(500).send({mensaje:'El cuestionario no tiene preguntas'})
                    }
                })
                //la variable sale indefinida
                //hay que buscar que el array que viene de angular se compare aqui con las respuestas del cuestionario
                console.log(respuestaAlumno)
                RespuestaModel.idCuestionario=cuestionarioEncontrado.idCuestionario;
                RespuestaModel.idAlumno= alumnoLog;
                // for(let i=0; i<respuestaAlumno.length; i++){
                //     notalTotal=notaTotal + respuestaAlumno[i].nota
                // }
                //RespuestaModel.calificacion=notaTotal;
                RespuestaModel.save((err, respuestasCalificadas)=>{
                    console.log("Esta guardando...")
                    if(!underscore.isEmpty(err)) return res.status(400).send({ mensaje: 'error en la peticion '+ err })
                    if(underscore.isEmpty(respuestasCalificadas)) return res.status(400).send({ mensaje: 'No se guardo la calificacion' })
                    return res.status(200).send({califiacion: respuestasCalificadas})
                })
            } else{
                return res.status(500).send({mensaje:'El cuestionario no existe'})
            }
        })
        // Respuesta.find({idAlumno: alumnoLog}).populate('idCuestionario').exec((err,respuestaEncontrada)=>{
            
        //     for(let i=0; i <respuestaEncontrada.length; i++){
        //         if(respuestaEncontrada[i].idCuestionario.respuesta == parametros.respuesta) return res.status(400).send({mensaje:'A'})
        //     }

        //     Cuestionario.findOne({respuesta:parametros.respuesta},(err,cuestionarioEncontrado)=>{
        //         if (err) return res.status(400).send({ mensaje: 'Error en la peticion' })
        //         if (!cuestionarioEncontrado) return res.status(400).send({ mensaje: 'Esta respuesta, no existe' })

        //         RespuestaModel.respuesta = parametros.respuesta;
        //         RespuestaModel.idCuestionario = cuestionarioEncontrado._id;
        //         RespuestaModel.idAlumno = alumnoLog;

        //         RespuestaModel.save((err,respuestaAlumnoGuardada)=>{
        //             if (err) return res.status(400).send({ mensaje: 'Error en la peticion' })
        //             if (!respuestaAlumnoGuardada) return res.status(400).send({ mensaje: 'No se pudo guardar' })
        //             return res.status(200).send({respesta:respuestaAlumnoGuardada})
        //         })
        //     })



        // })

    }else{
        return res.status(500).send({mensaje:'Debe enviar las respuestas'})
    }

    


}




module.exports = {
    respuestaAlumno
}