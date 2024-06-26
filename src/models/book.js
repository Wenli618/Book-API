const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const { categorySchema } = require('./category')

// book schema

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    publishedDate: {
        type: Date,
        required: true
    },
    categoryId: {
        type: categorySchema,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 13
    },
    summary: {
        type: String,
        required:true,
        trim: true,
        minlength: 6,
        maxlength: 1000
    },
    publisher: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    language: {
        type: String,
        required:true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    coverImage: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// book model

const Book = mongoose.model('Book', bookSchema)

// validate book schema

function validateBook(book){
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        author: Joi.string().min(1).max(255).required(),
        publishedDate:Joi.date().required(),
        categoryId: Joi.objectId().required(),
        ISBN:Joi.string().min(10).max(13).required(),
        summary:Joi.string().min(6).max(1000).required(),
        publisher:Joi.string().min(2).max(255).optional(),
        language:Joi.string().min(2).max(100).optional(),
        coverImage:Joi.string().min(1).max(255).optional(),
        createdAt:Joi.date()
    })
    return schema.validate(book)
}

module.exports = {Book, validateBook, bookSchema};
 