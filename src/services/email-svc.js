import nodemailer from 'nodemailer'
import {logger} from '../utils/logger'
import { getConfirmEmailHtml } from '../utils/emails/confirm-email-html'
import { getForgotPasswordEmailHtml } from '../utils/emails/forgot-password-email-html'
import { getInviteEmailHtml } from '../utils/emails/invite-email-html'
import { google } from 'googleapis'

// const Oauth2 = google.auth.Oauth2

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
)

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

// const accessToken = oauth2Client.getAcessToken()



/**
 * This function sends an email via nodemailer
 * @param {String} to      -> To Email Address
 * @param {String} subject -> Subject of the email
 * @param {String} html    -> HTML to be sent as body or content
*/
const sendEmail = async (to, subject, html) => {
try {
    var accessToken = await oauth2Client.getAcessToken()
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        type         : "OAuth2",
        user         : process.env.EMAIL_ID, 
        clientId     : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENT_SECRET,
        refreshToken : process.env.REFRESH_TOKEN,
        accessToken  : accessToken
        },
    })

    const mailOptions = {
    from    : process.env.EMAIL,
    to      : to,
    subject : subject,
    html    : html,
    }

    /** Sending the email via transporter */
    await transporter.sendMail(mailOptions)

    logger.info(`Successfully sent email to ${to}`)
} catch (err) {
    logger.info(`Error while sending email to ${to}`)
    logger.info(err)
    throw err
}
}

/** 
 * In every email inorder to verify or identify the user we are sending the JWT token as request param to the front end URL
 * From there while hitting the API, it will be passed in the headers, which then will be decoded to req.user object 
 */


/**
 * This function sends a 'confim your email' mail to new tenants
 * @param {String} to     -> To Email Address
 * @param {String} token  -> A unique JWT token generated for the given user, used to recognize their identity
 */
const sendConfirmationEmail = async (to, token) => {
try {
    let html = getConfirmEmailHtml(`${process.env.APP_URL}verify?token=${token}`)
    let subject = 'Re: Confirm Your Email'

    await sendEmail(to, subject, html)
} catch (err) {
    logger.info(`Error while sending confirmation email to ${to}`)
    throw err
}
}

const sendForgotPasswordEmail = async (to, token) => {
try{
    let html = getForgotPasswordEmailHtml(`${process.env.APP_URL}update-password?token=${token}`)
    let subject = 'Re: Reset Your Password'

    await sendEmail(to, subject, html)
} catch (err) {
    logger.info(`Error while sending forgot password email to ${to}`)
    throw err
}
}

const sendInviteEmail = async (to, token) => {
try{
    let html = getInviteEmailHtml(`${process.env.APP_URL}join?token=${token}`)
    let subject = 'Re: You are invited to join Jeeves-assignment-app'

    await sendEmail(to, subject, html)
} catch (err) {
    logger.info(`Error while sending invite email to ${to}`)
    console.error(err);
}
}

export { sendConfirmationEmail, sendForgotPasswordEmail, sendInviteEmail }
