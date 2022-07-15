const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CursoSchema = Schema({
    nombreCurso:String,
    descripcion:String,
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Profesores' },
});

module.exports = mongoose.model('Cursos', CursoSchema);