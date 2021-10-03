import { verifyEmailAndSetPassword, updatePassword } from '../../services/user'

const routes = (app) => {
  app
    .route(`${process.env.BASE_PATH}/users/verifyEmailAndSetPassword`)
    .patch(verifyEmailAndSetPassword)
  app
    .route(`${process.env.BASE_PATH}/users/updatePassword`)
    .post(updatePassword)
}

export default routes
