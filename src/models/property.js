import mongoose from 'mongoose'
import bcrypt, { hash } from 'bcrypt'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const PropertySchema = mongoose.Schema({
    propertyName: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    locality: {type: String, required: true},
    address: {type: String, required: true},
    carpetArea: {type: String, required: true},
    propertyImages: {type: String, required: true},
    uploadedAt: {type: Date, default: Date.now}
})

module.exports = PropertySchema