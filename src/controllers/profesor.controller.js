const Profesor = require('../models/profesor.model');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
underscore= require('underscore');


function registrarProfesor(req,res){
    var parametros = req.body
    var profesorModelo = new Profesor();

    if(parametros.nombreProfe,parametros.email,parametros.password){

        profesorModelo.nombreProfe = parametros.nombreProfe;
        profesorModelo.email = parametros.email;
        profesorModelo.password = parametros.password;
        profesorModelo.rol = 'ROL_PROFESOR';

        Profesor.find({nombreProfe:parametros.nombreProfe},(err,profesorRegistrado)=>{
            //if(profesorRegistrado.lenght == 0){
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    profesorModelo.password = passwordEncriptada; 
                    profesorModelo.save((err,profesorGuardado)=>{
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!profesorGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                        return res.status(201).send({ Profesor: profesorGuardado });
                    })

                })
            /*}else{
                return res.status(500).send({ mensaje: 'Este nombre de profesor, ya  se encuentra en uso' });
            }*/
        })
    }else{
        return res.status(500).send({ mensaje: 'Llene todos los campos' });
    }
}

function loginProfesor(req,res){
    var parametros = req.body;

    Profesor.findOne({email:parametros.email},(err,profesorEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (profesorEncontrado) {
            bcrypt.compare(parametros.password, profesorEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(profesorEncontrado) })
                        } else {
                            profesorEncontrado.password = undefined;
                            return res.status(200)
                                .send({ Profesor: profesorEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el nombre de usuario no se encuentra registrado.' })
        }
    })
}

function editarProfesor(req,res){
    var idProfesor = req.params.idProfesor
    var parametros = req.body;

    Profesor.findByIdAndUpdate(idProfesor,parametros,{new:true},(err,profesorActualizado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!profesorActualizado) return res.status(404).send({ mensaje: 'Error al editar el profesor' });
        return res.status(200).send({ ProfesorEditado: profesorActualizado })
    })

}

function eliminarProfesor(req,res){
    var idProfesor = req.params.idProfesor;

    Profesor.findByIdAndDelete(idProfesor,(err,profesorEliminado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!profesorEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el profesor' });
        return res.status(200).send({ ProfesorEliminado: profesorEliminado })
    })
}


//Buscar Profesor 
function buscarProfesor(req,res){
    Profesor.find((err,profesorEncontrado)=>{
        if (err) return res.send({ mensaje: "Error: " + err })
        for (let i = 0; i < profesorEncontrado.length; i++) {

        }
        return res.status(200).send({ ProfesorEncontrado: profesorEncontrado })
    })
}

//Buscar profesor ID 
function buscarProfesorID(req,res){
    var idProfesor = req.params.idProfesor;

    Profesor.findById(idProfesor,(err,profesorEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!profesorEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos del profesor' });
        return res.status(200).send({ ProfesorEncontrado: profesorEncontrado })
    })
}

module.exports={
    loginProfesor,
    registrarProfesor,
    editarProfesor,
    eliminarProfesor,
    buscarProfesor,
    buscarProfesorID
}