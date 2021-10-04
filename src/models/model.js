import mongoose from 'mongoose'
const UserSchema = require('./user.js')
const PropertySchema = require('./property')


const models = {
    User: mongoose.model('User', UserSchema),
    Property: mongoose.model('Property', PropertySchema)
}

// this is to create each collection explicitly
Object.values(models).forEach(model => {
    model.createCollection()
})

module.exports = {
    User: models.User,
    Property: models.Property
}