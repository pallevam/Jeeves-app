import JOI from 'joi'


/* User controller validation */

const userValidation = {
    updateUserValidation: JOI.object().keys({
        firstName: JOI.string().trim().allow('').optional().max(55).label('Invalid first name!'),
        lastName: JOI.string().trim().allow('').optional().max(55).label('Invalid last name!'),
        email: JOI.string().trim().email().lowercase().label('Invalid email address!'),
        password: JOI.string().trim().allow('').optional().min(5).max(25).label('Invalid password!')
    }),
    signUpUserValidation: JOI.object().keys({
        firstName: JOI.string().trim().required().max(55).label('Invalid first name!'),
        lastName: JOI.string().trim().required().max(55).label('Invalid last name!'),
        email: JOI.string().trim().email().lowercase().required().label('Invalid email address!'),
        password: JOI.string().trim().allow('').optional().min(5).max(25).label('Invalid password!'), 
    }),
    loginValidation: JOI.object().keys({
        email: JOI.string().trim().required().email().lowercase().label('Invalid email address!'),
        password: JOI.string().trim().required().min(5).max(25).label('Invalid password!'),
    }),
}

module.exports = {
    updateUserValidation : userValidation.updateUserValidation,
    loginValidation : userValidation.loginValidation,
    signUpUserValidation: userValidation.signUpUserValidation,
}
  