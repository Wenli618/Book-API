const mongoose = require('mongoose')
const Joi = require('joi')

// category schema
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50,
    }
})

// category model
const Category = mongoose.model('Category', categorySchema)

// validate
function validateCategory(category){
    const schema = Joi.object({
        name:Joi.string().min(2).max(50).required()
    })
    return schema.validate(category)
}

module.exports = { categorySchema, Category, validateCategory }