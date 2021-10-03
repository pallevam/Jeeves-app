import mongoose from 'mongoose'
import bcrypt, { hash } from 'bcrypt'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, trim: true, minlength: 5 },
    isVerified: {type: Boolean, default: false},
    createdAt: Number,
    updatedAt: Number
}, opts)

UserSchema.methods.toJSON = () => {
    const { password, ...rest } = this.toObject()
    return rest
}

UserSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password).then((result) => {
        if(result){
            cb(null, 'authentication successful')
        }else {
            cb('authentication failed. Password does not match')
        }
    }).catch((err) => cb(err))
}

UserSchema.statics.getAuthenticated = (user, password, cb) => {
    user.comparePassword(password, (err, result) => {
        if(err) cb(err)
        else cb(err, result)
    })
}

UserSchema.pre('save', (next) => {
    let user = this
    if(!user.isModified('password')) return next()
    bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR), (err, salt) => {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })
})

module.exports = {UserSchema}