const express = require('express')
require('express-async-errors');
// Automatically handles async errors (add try catch to all rou)

require('dotenv').config()


const app = express()

const fileUpload = require('express-fileupload')

const mongoose = require('mongoose')
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); //Adds Object ID validation to Joi
const helmet = require('helmet')
const cors = require('cors')

const error = require('./middleware/error')

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/"; 

const config = require('config')
const connectionString = config.get("db.connectionString")
const serverPort = config.get('port')
const bookshelfPrivateKey = config.get('bookshelfPrivateKey')
if(!bookshelfPrivateKey){
    console.error('Error: bookshelfPrivateKey is not defined')
    process.exit(1)
}

// connect to mongoose
async function connect(){
    try {
        const connectionResult = await mongoose.connect(connectionString)
        if(connectionResult) console.log('Connected to MongoDB!')
    }catch(err){
(err)=>console.error('Connection failed', err)}
}
connect();

// use middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use(fileUpload({createParentPath:true})) 
app.use('/uploads', express.static('uploads')); 
// e.g.: http://localhost3000/uploads/avatarts/file.png


// import routes
const categories = require('./routes/categories')
const books = require('./routes/books')
const collections = require('./routes/collections')
const users = require('./routes/users')
const login = require('./routes/login')


// Routes
app.use('/api/users', users)
app.use('/api/users/login', login)
app.use('/api/categories', categories)
app.use('/api/books', books)
app.use('/api/users/collections',collections)

app.use(error)
// start server
const port = process.env.PORT || serverPort
app.listen(port, ()=>console.log(`Listening on port ${port}...`))