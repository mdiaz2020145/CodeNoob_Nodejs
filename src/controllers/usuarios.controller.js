const Alumno = require('../models/alumno.model');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
underscore= require('underscore');

//Registrar SuperAdmin 
/*function registrarSuperAdmin(req, res) {
    var usuarioModelo = new Usuario();
    usuarioModelo.nombre = 'SUPER_ADMIN';
    usuarioModelo.email = 'SUPER_ADMIN';
    usuarioModelo.rol = 'ROL_SUPERADMIN';


    Usuario.find({ email: 'SUPER_ADMIN', nombres: 'SUPER_ADMIN' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                })
            })
        } else {
            console.log('El usuario super admin ya esta creado')
        }
    })
}*/

//Registrar Alumno
function registrarAlumno(req, res){ 
    var parametros = req.body;
    var alumnoModelo = new Alumno();

    if ( parametros.nombreUsuario, parametros.email, parametros.password) {
        alumnoModelo.nombreUsuario = parametros.nombreUsuario;
        alumnoModelo.email = parametros.email;
        alumnoModelo.password = parametros.password;
        alumnoModelo.rol = 'ROL_ALUMNO';
        alumnoModelo.puntosTotales = parametros.puntosTotales;

        Alumno.find({ nombreUsuario: parametros.nombreUsuario}, (err, alumnoRegistrado) => {
            if (alumnoRegistrado.length == 0) {
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    alumnoModelo.password = passwordEncriptada;
                    alumnoModelo.save((err, alumnoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!alumnoGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                        return res.status(201).send({ Alumno: alumnoGuardado });
                    })

                })
            } else {
                return res.status(500).send({ mensaje: 'Este nombre de usuario, ya  se encuentra en uso' });
            }

        })
    }else{
        return res.status(500).send({ mensaje: 'Llene todos los campos' });
    }
}

function login(req, res) {
    var parametros = req.body;
    Alumno.findOne({ nombreUsuario: parametros.nombreUsuario }, (err, alumnoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (alumnoEncontrado) {
            bcrypt.compare(parametros.password, alumnoEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(alumnoEncontrado) })
                        } else {
                            alumnoEncontrado.password = undefined;
                            return res.status(200)
                                .send({ Alumno: alumnoEncontrado })
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

//Editar alumno
function editarAlumno(req, res) {
    var idAlumno = req.params.idAlumno;
    var parametros = req.body;
    Alumno.findByIdAndUpdate(idAlumno, parametros, { new: true }, (err, alumnoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!alumnoActualizado) return res.status(404).send({ mensaje: 'Error al editar el alumno' });
        return res.status(200).send({ AlumnoEditado: alumnoActualizado })
    })
}

//Eliminar alumno
function eliminarAlumno(req, res) {
    var id = req.params.idAlumno;
    Alumno.findByIdAndDelete(id, (err, alumnoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!alumnoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el alumno' });
        return res.status(200).send({ AlumnoEliminado: alumnoEliminado })
    })

}


//Buscar alumno
function buscarAlumno(req, res) {
    Alumno.find((err, alumnoEncontrado) => {
        if (err) return res.send({ mensaje: "Error: " + err })
        for (let i = 0; i < alumnoEncontrado.length; i++) {

        }
        return res.status(200).send({ AlumnoEncontrado: alumnoEncontrado })
    })
    
}


//Buscar alumno por ID
function buscarAlumnoID(req, res) {
    var idAlumno = req.params.idAlumno;
    Alumno.findById(idAlumno, (err, alumnoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!alumnoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos del alumno' });

        return res.status(200).send({ AlumnoEncontrado: alumnoEncontrado })
    })
}

module.exports={
    //registrarSuperAdmin
    registrarAlumno,
    login,
    editarAlumno,
    eliminarAlumno,
    buscarAlumno,
    buscarAlumnoID
}