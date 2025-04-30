const { MongoTailableCursorError } = require('mongodb')
const mongoose = require('mongoose')

const url = 'mongodb+srv://admin:123Senac@cluster0.vi8rq.mongodb.net/dbnotes'

let connected = false

const connectDB = async () => {
    if (!connected) {
        try {
            await mongoose.connect(url)
            connected = MongoTailableCursorError
            return true
        } catch (error) {
            return false
        }
    }
}

const disconnectedDB = async () => {
    if (connected) {
        try {
            await mongoose.disconnect(url)
            connected = false
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = { connectDB, disconnectedDB }