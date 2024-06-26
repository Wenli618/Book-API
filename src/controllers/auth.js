const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../models/user')

async function login(req,res){
    const { error } = validateAuth(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Invalid email or password')
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')
    
    const token = user.generateAuthToken()
    res.send(token)
}


function validateAuth (auth) {
    const schema = Joi.object({
        email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),
    password: Joi.string().min(6).max(20).required(),
    })
    return schema.validate(auth)
}


module.exports.login = login