const mongoose = require('mongoose')
const Joi = require('joi')
// Joi.objectId = require('joi-objectid')(Joi)

// collection schema
const collectionSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// book model

const Collection = mongoose.model('Collection', collectionSchema)

// validate book schema
function validateCollection(collection){
    const schema = Joi.object({
        bookId: Joi.objectId().required(),
        // userId:Joi.objectId().required(),
        createdAt:Joi.date()
    })
    return schema.validate(collection)
}

module.exports = {Collection, validateCollection, collectionSchema};
 