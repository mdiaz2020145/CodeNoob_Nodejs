const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuestionarioSchema = Schema({
    cuestionario: String,
    numeroLeccion: Number,
    items: [{
        pregunta: String,
        respuesta: String,
        puntosPregunta: Number
    }],
    total: Number,
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    idCurso: { type: Schema.Types.ObjectId, ref: 'Cursos' }
})

module.exports = mongoose.model('Cuestionarios', CuestionarioSchema);