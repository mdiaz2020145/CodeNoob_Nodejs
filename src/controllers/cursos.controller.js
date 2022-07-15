const Curso = require('../models/cursos.model');
underscore= require('underscore');


function agregarCurso(req,res){
    var parametros = req.body
    var cursoModel = new Curso();

    if(parametros.nombreCurso){
        cursoModel.nombreCurso = parametros.nombreCurso;
        cursoModel.idProfesor=req.user.sub
        if(!underscore.isEmpty(parametros.descripcion)) cursoModel.descripcionCurso = parametros.descripcion
        Curso.findOne({nombreCurso:parametros.nombreCurso},(err,cursoEncontrado)=>{
            if(underscore.isEmpty(cursoEncontrado)){
                cursoModel.save((err, cursoGuardado)=>{
                    if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                    if (!cursoGuardado) return res.status(404).send({ mensaje: 'No se agrego el curso' });
                    return res.status(200).send({ Curso: cursoGuardado });
                })
            }else{
                return res.status(500).send({ mensaje: 'El nombre de este curso ya esta en uso, utilice otro' });
            }
        })
    }else{
        return res.status(500).send({ mensaje: 'Llene todos los campos' });
    }
}

function editarCurso(req,res){
    var idCurso = req.params.idCurso;
    var parametros = req.body;

    Curso.findByIdAndUpdate(idCurso,parametros,{new:true},(err,cursoActualizado)=>{
        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion ' });
        if (!cursoActualizado) return res.status(404).send({ mensaje: 'Error al editar el curso' });
        return res.status(200).send({ Curso: cursoActualizado })
    })

}

function eliminarCurso(req,res){
    var idCurso = req.params.idCurso;

    Curso.findByIdAndDelete(idCurso,(err,cursoEliminado)=>{
        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
        if (!cursoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el curso' });
        return res.status(200).send({ Curso: cursoEliminado })
    })
}

function buscarCursos(req,res){
    Curso.find((err,cursosEncontrados)=>{
        if (err) return res.send({ mensaje: "No se realizo la accion" })
        if (!cursosEncontrados) return res.status(404).send({ mensaje: 'Error al encontrar los cursos' });
        return res.status(200).send({ Cursos: cursosEncontrados })
    })
}

function buscarCursoId(req,res){
    var idCurso = req.params.idCurso;

    Curso.findById(idCurso,(err,cursoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
        if (!cursoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener el curso' });
        return res.status(200).send({ Curso: cursoEncontrado })
    })
}

module.exports={
    agregarCurso,
    editarCurso,
    eliminarCurso,
    buscarCursos,
    buscarCursoId
}