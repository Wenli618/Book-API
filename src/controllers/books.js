const { Book, bookSchema, validateBook } = require('../models/book')
const { Category } = require('../models/category')
const { fileUploader, deleteFile,validateFile } = require('../util/fileUploader')
const mongoose = require('mongoose')


module.exports = {

    async getAllBooks(req,res){
        const books = await Book.find().sort('title')
        res.send(books)
    },

    async getBookById(req,res){
         // Check if the ID is a valid ObjectId
        const bookId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        try{
            console.log(req.params.id)
            const book = await Book.findById(req.params.id)
            if(!book) return res.status(404).send('The book by given Id was no been found')
            res.send(book)
        }catch(err){
            console.log(err)
        }
    },

    async createBook(req,res){
        try{
            let { error } = validateBook(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            // Check if the category exists
            const category = await Category.findById(req.body.categoryId)
           
            if(!category) return res.status(404).send('Invalid category.')

            // Check if the ISBN already exists
            let existingBook = await Book.findOne({ ISBN: req.body.ISBN });
            if (existingBook) return res.status(400).send('A book with this ISBN already exists.');

            let data = {
                title: req.body.title,
                author: req.body.author,
                publishedDate:req.body.publishedDate,
                categoryId:{
                    _id:category._id,
                    name:category.name
                },
                ISBN:req.body.ISBN,
                summary:req.body.summary,
                publisher:req.body.publisher,
                language:req.body.language
            }    
            
            // upload fine and save it to the correct folder
            if(req.files){
                // validate upload cover file
                error = validateFile(req.files.coverImage, 1000000, ["PNG","JPG","JPEG"])
                if(error) return res.status(400).send(error)
                const filePath = fileUploader(req.files.coverImage, './uploads/bookCoverImages/', req.body.title)
                data.coverImage = filePath
            }
            
            let book = new Book(data)
            book = await book.save()
            res.send(book)
        }catch(err){
            console.log(err)
        }
    },

    async editBook(req,res){
        // Check if the ID is a valid ObjectId
        const bookId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        try{
            let book = await Book.findById(bookId)

            if(!book){
                return res.status(404).send('The book with the givin ID was not found!')
            }

            let { error } = validateBook(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            // Check if the category exists
            const category = await Category.findById(req.body.categoryId)
            if(!category) return res.status(404).send('Invalid category.')

            // Check if the ISBN already exists
            let existingBook = await Book.findOne({ ISBN: req.body.ISBN });
            
            if (existingBook&&existingBook._id!=req.params.id) return res.status(400).send('A book with this ISBN already exists.');

            let data = {
                title: req.body.title,
                author: req.body.author,
                publishedDate:req.body.publishedDate,
                categoryId:{
                    _id:category._id,
                    name:category.name
                },
                ISBN:req.body.ISBN,
                summary:req.body.summary,
                publisher:req.body.publisher,
                language:req.body.language
            } 
            
            let filePath = null
            if(req.files){
                error = validateFile(req.files.coverImage, 1000000, ["PNG", "JPEG", "JPG"])
                if (error) return res.status(400).send( error)
                
                // delete old file
                filePath = book.coverImage
                if(filePath){
                    deleteFile(filePath)
                }
                filePath = fileUploader(req.files.coverImage, "./uploads/bookCoverImages/",req.body.title)
                data.coverImage = filePath    
            }

            book = await Book.findByIdAndUpdate(
                req.params.id, data, { new: true })
            res.send(book)
        }catch(err){
            console.log(err)
        }
    },

    async deleteBook(req,res){
        // Check if the ID is a valid ObjectId
        const bookId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        try{
            let book = await Book.findById(bookId)
            if(!book) return res.status(404).send('The book with given ID does not exist')
            const filePath = book.coverImage
            deleteFile(filePath)
            book = await Book.findByIdAndDelete(req.params.id)
            res.send(`The book [${book.title}] has been deleted.`)
        }catch(err){
            console.log(err)
        }
    }
}