const { MongoTailableCursorError } = require('mongodb')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'

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