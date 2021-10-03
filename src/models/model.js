import mongoose from 'mongoose'
const UserSchema = require('./user.js')


const models = {
    User: mongoose.model('User', UserSchema),
}

// this is to create each collection explicitly
Object.values(models).forEach(model => {
    model.createCollection()
})

module.exports = {
    User: models.User
}