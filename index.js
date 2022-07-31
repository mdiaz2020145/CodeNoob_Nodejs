/*const mongoose = require('mongoose')
const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/CodeNoob', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Conexion a la base de datos exitosa')

    app.listen(3000, function () {
        console.log('Corriendo en el puerto 3000')
    })

    //UsuarioController.registrarSuperAdmin();

}).catch(err => console.log(err))*/

const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Conexion a la base de datos exitosa')

    app.listen(process.env.PORT || 3000, function () {
        console.log('Corriendo en el puerto 3000')
    })

    //UsuarioController.registrarSuperAdmin();

}).catch(err => console.log(err))