
const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

// user schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        unique:true,
    },
    password:{
        type: String,
        required:true,
        minLength:6,
        maxLength:255,
    },
    avatar:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }

})

// generate Auth Token function
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email,
        avatar:this.avatar,
        isAdmin:this.isAdmin
    }, config.get('bookshelfPrivateKey'))
    return token
}

// user model
const User = mongoose.model('User', userSchema)

// Joi validation
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .required(),
        password: Joi.string().min(6).max(255).required(),
        avatar:Joi.string().optional(),
        isAdmin:Joi.boolean(),
    })
    return schema.validate(user)
}

module.exports = { User, validateUser}
