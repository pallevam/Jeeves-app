import {joi} from '../../middleware/joiValidator'
const { loginValidation, signUpUserValidation } = require('../../validations/user.js')
const { login, signup, requestForgotPasswordLink } = require('../../services/user')

const routes = (app) => {
    app
    .route(`${process.env.BASE_PATH}/users/login`)
    .post(joi(loginValidation, 'body'), login)
    app
    .route(`${process.env.BASE_PATH}/signup`)
    .post(joi(signUpUserValidation, 'body'), signup)
  app
    .route(`${process.env.BASE_PATH}/users/forgotPassword`)
    .post(requestForgotPasswordLink)
}

export default routes