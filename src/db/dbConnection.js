import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoOptions = {
    user: process.env.DB_USER_NAME,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_Name,
    retryWrites: false,
    keepAlive: true
}

export async function initClientDbConnection () {
    mongoose.connect(process.env.DB_URL, mongoOptions)
    global.db = mongoose.connection

    global.db.on('open', () => {
        console.log(`Mongoose connection open on : ${JSON.stringify(process.env.DB_URL_TEMPLATE)}`)
    })
    global.db.on('error', (err) => {
        console.log(`Mongoose connection error: ${err} with connection info ${JSON.stringify(process.env.MONGODB_URL)}`)
    })
    return global.db
}