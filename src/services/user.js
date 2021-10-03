import nodemailer from 'nodemailer'
import { logger } from '../utils/logger'
import { google } from 'googleapis'
import {sendConfirmationEmail, sendInviteEmail, sendForgotPasswordEmail } from './email-svc'
import {generateHash} from '../utils/bcrypt-helper'
import { generateToken, setToken } from '../security/auth'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import { handleSaveRecordError } from '../utils/generic_utils'

/** 
 * user login
 * @access public
 * @param {email} email - email id of the user
 * @param {password} password - password of the user
*/

export async function login(req, res) {
    try{
        let { email, password } = req.body
        let user = await User.findOne({ email: email })
        if(!user) return res.status(404).send({ status: 'error', message: 'User does not exist!'})
        if(_.isUndefined(user.password)) return res.status(422).send({ status: 'failed', message: 'Please reset your password'})

        await generateToken(user, password, (err, result) => {
            let { statusCode, status, message, accessToken } = result || err
            if(err) res.status(statusCode).send({ status, message, accessToken })
            else res.status(statusCode).send({ status, message, accessToken })
        })
    }catch (error) {
        res.status(500).send({ status: 'error', message: 'Server error, try after some time!'})
    }
}

export async function signup(req, res) {
    const session = await global.debug.startSession()
    try{
        const { firstName, lastName, email, password } = req.body
        if(!(firstName && lastName && email && password)) res.status(400).send("User input required for all fields!")
        const existingUser = User.findOne({ email })

        if(existingUser){
            return res.status(409).send("User already exists. Please login!")
        }

        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        })

        let token = setToken(user)
        console.log(token)
        await sendConfirmationEmail(email, token)
        res.status(201).json({ status: 'success', message: 'New user created, kindly verify your email to proceed!'})
    
    }catch (err) {
        res.status(500).send(await handleSaveRecordError(err))
    }
}

export async function verifyEmailAndSetPassword(req, res) {
    try{
        let{ _id } = req.user
        let userFromDb = await User.findOne({ _id: _id })
        if(userFromDb.isVerified) return res.status(400).json({ status: 'Failure', message: 'Already verified user'})
        let hashedPassword = await generateHash(req.body.password)
        await User.findByIdAndUpdate({ _id: _id}, { $set: { password: hashedPassword, isVerified: true}}, {})
        return res.status(200).json({ status: 'success', message: 'Successfully updated the user', token: setToken(userFromDb)})

    }catch (error) {
        logger.info('Error while verifying the user')
        res.status(500).send({ status: 'error', message: error.message})
    }
}

/** This API send's a reset password email to the user */
export async function requestForgotPasswordLink(req, res) {
    try {
      let { email } = req.body
  
      let userFromDb = await User.findOne({ email: email })
      if (!userFromDb) return res.status(404).json({ status: 'Error', message: 'User not found' })
      await sendForgotPasswordEmail(email, setToken(userFromDb))
      return res.status(200).json({ status: 'success', message: 'Kindly Check Your inbox for further steps' })
    } catch (err) {
      logger.info('Error while sending forgot password link')
      return res.status(500).send({ status: 'error', message: err.message })
    }
}

export async function updatePassword(req, res) {
    try {
      let user = req.user
      let { password } = req.body
  
      let hashedPassword = await generateHash(password)
      await User.findOneAndUpdate({ _id: user._id }, { $set: { password: hashedPassword } })
      return res.status(200).json({ status: 'success', message: 'Updated the password of the user' })
    } catch (err) {
      logger.info(err)
      return res.status(500).send({ status: 'error', message: err.message })
    }
}