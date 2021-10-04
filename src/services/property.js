import _ from 'lodash'
import { logger } from '../utils/logger'
const { Property } = require('../models/model')
import { handleSaveRecordError } from '../utils/generic_utils'
import { Formidable } from 'formidable'
import cloudinary from 'cloudinary'
import { response } from 'express'
/**
 * @api {POST} /property/create-property
 * @summary User will create new property that can be viewed by authorized other users
 * @pathParam {} -
 * @apiPermission authenticated user
 * @response 200 
 */

export const createProperty = async (req, res) => {
    if(!req.body.propertyName) {
        return res.status(400).send({ message: 'Cannot add empty property details.'})
    }
    const form = new Formidable.IncomingForm()
    form.parse(request, (err, fields, files) => {
        const {propertyName, description, price, locality, carpetArea, address} = fields
        const { propertyImages } = files

        cloudinary.UploadStream.upload(
            propertyImages.path, {folder: "../public/root/property_images"}, async (error, results) => {
                const property_image_url = results.url

                const newPropertyListing = new Property({
                    propertyName,
                    description,
                    price,
                    locality,
                    carpetArea,
                    address,
                    propertyImages: property_image_url
                })
            }
        )
        const propertySaved = await newPropertyListing.save()
        return response.status(200).json(propertySaved)
    })
}

/* get all properties */
export const getProperty = async (req, res) => {
    const {limit, skip, page} = req.pagination
    const filterProperties = req.filterProperties || {}
    try{
        let [properties] = await Property.aggregate([
            {$match: filterProperties},
            {'$facet': {
                meta: [ { $count: 'total' }, { $addFields: { page: page } } ],
                data: [ { $skip: skip }, { $limit: limit } ], 
            }},
            {$project:  global.paginationProject},
        ])
        if (_.isEmpty(connectors['data'])) res.status(404).send({status: 'error', message: 'record not found!'}) 
        else res.status(201).send(properties)
    } catch(err) {
        res.status(500).send({status: 'error', message: err})
    }
}

/* search for a property */
export const searchProperty = async (req, res) => {
    const properties = [panajiHouse, goaHouse, hyderabadHouse, mumbaiHouse]
    const query = req.params.query

    const result = []
    for(let prop = 0; prop < properties.length; prop++) {
        let currProp = properties[prop]
        if (query.toLowerCase().includes(currProp.toLowerCase())) {
            result.push(currProp);
        }
    }

    Property.find({
        "Property": result[0]
    })
    .exec()
    .then((data) => {
        return res.status(200).json(data)
    })
    .catch((err) => {
        logger.info(err)
    })
}