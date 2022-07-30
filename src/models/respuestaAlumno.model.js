const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const respuestaAlumno = new Schema({
    respuesta:String,
    idCuestionario: { type: Schema.Types.ObjectId, ref: 'Cuestionarios' },
    idAlumno: {type: Schema.Types.ObjectId,ref:'Alumnos'}
})

module.exports = mongoose.model('Respuestas', respuestaAlumno);