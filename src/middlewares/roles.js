exports.verAlumnos=function(req, res, next) {
    if(req.user.rol!=="ROL_ALUMNO") return res.status(403).send({mensaje: "Solo el alumno puede continuar"});

    next();
}

exports.verProfesor=function(req, res, next) {
    if(req.user.rol!=="ROL_PROFESOR") return res.status(403).send({mensaje: "Solo el profesor puede continuar"});

    next();
}