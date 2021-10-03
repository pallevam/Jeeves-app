import jwt from 'jsonwebtoken'
const User = require('../models/model')

export const authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                if(err) return res.status(401).json({'status': 'error', 'message': 'Token is not valid.'})
                req.user = decoded
                next()
            })
        }else return res.status(401).send({ status: 'error', message: 'No token, Authorization Denied'})
    } catch(err) {
        res.status(403).json({ 'status': 'error', 'message': 'Forbidden! Youare not allowed to authenticate'})
    }
}

export const setToken = (user) => {
    const token_payload = { userRole: user.userRole, _id: user._id}
    const accessToken = jwt.sign(token_payload, process,env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE })
    return accessToken
}

export const generateToken = async (user, password, cb) => {
    User.getAuthenticated(user, password, async (err) => {
        if(err) return cb({statusCode: 403, status: 'error', message: err})
        const accessToken = await setToken(user)
        cb(err, {statusCode: 200, status: 'success', message: 'Bearer Token generated!', accessToken })
    })
}

