import { createProperty, getProperty, searchProperty } from "../../services/property"

const routes = (app) => {
    app
    .route(`${process.env.BASE_PATH}/getProperty`)
    .get(getProperty)
    app
    .route(`${process.env.BASE_PATH}/createProperty`)
    .post(createProperty)
    app
    .route(`${process.env.BASE_PATH}/searchProperty`)
    .post(searchProperty)
}

export default routes