/**
 * Modelagem de dados - tbl_notas
 */

const { model, Schema } = require('mongoose')

const noteSchema = new Schema({
    texto: {
        type: String
    },
    cor: {
        type: String
    }
}, {versionKey: false})

// Exportar dados ao "main.js"
module.exports = model('Notas', noteSchema)