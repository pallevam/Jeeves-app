import dotenv from 'dotenv'
dotenv.config()
import './env.js'
import { initClientDbConnection } from './src/db/dbConnection.js'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
const __dirname = path.resolve();
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { pagination } from './src/helpers/pagination.js'
import { logger } from './src/utils/logger.js'
import morgan from 'morgan'
import listEndpoints from 'express-list-endpoints'
import helmet from 'helmet';
import cors from 'cors'
import { authenticate } from './src/security/auth.js'
import userLoginSingupRoute from './src/routes/login-signup/user'
import userSecureRoute from './src/routes/secure/user'
import propertySecureRoute from './src/routes/secure/property'
import Formidable from 'formidable'


// mongoose.set('useCreateIndex', true)
const app = express()
const PORT = process.env.PORT || 3000

// general config
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')

// API logger
app.use(morgan('dev'))

const corsOptions = {
    credentials: true, origin:(origin, callback) => {
        callback(null, true)
    }
}



// Direct express to use helmet to enable simple security settings
app.use(helmet())
app.use(cors(corsOptions))
app.enable('trust proxy')
app.set('trust proxy', 1)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Accept, Authorization, Content-Type, Access-Control-Request-Method,Access-Control-Allow-Origin, Access-Control-Allow-Headers, Accept,x-auth-token, mix-panel',
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') {
        res.status(200).send({ success: true })
    } else next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '10kb' }))
app.use(pagination)

/* GET Home page */
app.get('/', (req, res) => {
    res.render('index.ejs')
})

/* Retrieve a list of passed routes */
app.get(process.env.BASE_PATH + '/exposed', (req, res) => {
    res.status(200).send(listEndpoints(app))
})

/* Initializing database connection */
global.clientConnection = initClientDbConnection()

// user login-signup route
userLoginSingupRoute(app)

/* routes which require authentication */
app.use(authenticate)
userSecureRoute(app)
propertySecureRoute(app)



// Error handler at global level
app.use((error, req, res, next) => {
    logger.error('Error: ', error)
    res.status(error.status ? error.status : 500).send(error.message ? error.message: error)
    next(error)
})

app.listen(PORT, () => {
    logger.info(`NODE_ENV: ${process.env.NODE_ENV}`)
    logger.info(`Server is running on port ${PORT}.`)
})
