const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const respuestaAlumno = new Schema({
    respuestas:[{respuesta: String, nota:Number}],
    idCuestionario: { type: Schema.Types.ObjectId, ref: 'Cuestionarios' },
    idAlumno: {type: Schema.Types.ObjectId,ref:'Alumnos'},
    calificacion: Number
})

module.exports = mongoose.model('Respuestas', respuestaAlumno);