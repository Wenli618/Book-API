const mongoose = require('mongoose')

const { Collection, collectionSchema, validateCollection } = require('../models/collection')

const { Book} = require('../models/book')



module.exports = {

    async getUserCollections(req,res){
        const collections = await Collection.find({userId:req.user._id}).sort('createdAt')
        res.send(collections)
    },

    async createUserCollection(req,res){
        try{
            let { error } = validateCollection(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            // Check if the book exists
            let book = await Book.findById(req.body.bookId)
            if(!book) return res.status(404).send('Invalid bookId.')
                console.log('userid:', req.user._id)

            // check if user already has the book in the collection
            book = await Collection.find({userId:req.user._id,bookId:req.body.bookId})
            console.log('bookcheck:',book)
            if(book && book.length != 0) return res.status(400).send('This book is already in the collection')
            
            // create new collection
            let collection = new Collection({
                bookId: req.body.bookId,
                userId: req.user._id,
            })
            collection = await collection.save()
            res.send(collection)
        }catch(err){
            console.log(err)
        }
    },

    async deleteCollection(req,res){
        // Check if the ID is a valid ObjectId
        const collectionId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(collectionId)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        try{
            let collection = await Collection.findByIdAndDelete(collectionId)
            if(!collection) return res.status(404).send('The Collection with given ID does not exist')
            res.send('This collection has been removed')
        }catch(err){
            console.log(err)
        }
    }
}