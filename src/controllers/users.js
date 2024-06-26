const bcrypt = require('bcrypt')
const _ = require('lodash')

const { User, validateUser} = require('../models/user')
const { fileUploader, validateFile, deleteFile} = require('../util/fileUploader')

module.exports = {
     async createUser(req, res){
  
        try{  
            let error = validateUser(req.body)
            if(error.error) return res.status(400).send(error.error.details[0].message)
        
            let user = await User.findOne({email:req.body.email})
            if(user) return res.status(400).send('The Email already in use!')
            
            let data = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const salt = await bcrypt.genSalt(10)
            data.password = await bcrypt.hash(data.password, salt)

            if(req.files){
                error = validateFile(req.files.avatar, 1000000, ['PNG','JPEG','JPG'])
                if(error) return res.status(400).send(error.error)
        
                const filePath = fileUploader(req.files.avatar, './uploads/avatars/', req.body.name)
                data.avatar = filePath
            }

            console.log('data:', data)

            user = new User(data)
            await user.save()
            console.log('savedUser:', user)

            const token = user.generateAuthToken()
            res.header('x-auth-token', token)
            let userData = _.pick(user,['_id','name','email','avatar'])
            userData.token = token
            res.send(userData)
            
        }catch(err){
            console.log(err)
        }
        
    },

   async getUserByTokenId(req,res){
    console.log('req.user:',req.user)
    const user = await User.findById(req.user._id).select('-password')
    console.log(user)
    res.send(user)
   },

   async editUser(req,res){
    try{
        let error = validateUser(req.body)
        if(error.error) return res.status(400).send(error.error.details[0].message)
        
        let data = req.user
        let user = _.pick(data, ['_id','name','email','avatar','isAdmin'])

        if(req.body.name){
            user.name = req.body.name
        }
        if(req.body.email){

            user.email = req.body.email
        }
        if(req.body.password){
            user.password = req.body.password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
        console.log('user:',user)
        
        let filePath = null
        if(req.files){
            error = validateFile(req.files.avatar, 1000000, ['PNG','JPEG','JPG'])
                if(error) return res.status(400).send(error.error)
                
                filePath = user.avatar
                console.log('filePath:',filePath)
                if(filePath){
                    deleteFile(filePath)
                }
                filePath = fileUploader(req.files.avatar, './uploads/avatars/', req.body.name)
                user.avatar = filePath
        }
         updateUser = await User.findByIdAndUpdate(req.user._id,user, {new:true})
         res.send(updateUser)
    }catch(err){
        console.log(err)
    }
   }
}
