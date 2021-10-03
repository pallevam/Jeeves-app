import path from 'path'
const __dirname = path.resolve();
const endFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`
const pathToEnvFile = path.resolve(__dirname, endFileName)
// require('dotenv').config({ path: pathToEnvFile })
import dotenv from 'dotenv'
dotenv.config({ path: pathToEnvFile })