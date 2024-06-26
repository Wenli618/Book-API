const { Category, validateCategory } = require('../models/category')

module.exports = {
    async getAllCategories(req,res){
        const categories = await Category.find().sort('name')
        res.send(categories)
    },

    async createCategory(req,res){
        try{
            const { error } = validateCategory(req.body)
            if(error) return res.status(400).send(error)
            let existingCategory = await Category.findOne({
                name: req.body.name
            })
           
            if(existingCategory)
                return res.status(400).send('The given category name already exist')
            let category = new Category({
                 name:req.body.name
            })
            category = await category.save()
            res.send(category)
        }catch(err){
            console.log(err)
        }
    },

    async editCategory(req,res){
        try{
            const { error } = validateCategory(req.body)
            if(error) return res.status(400).send(error)
                
            let existingCategory = await Category.findOne({
                    name: req.body.name
            })
               
            if(existingCategory)
            return res.status(400).send('The given category name already exist')

            const category = await Category.findByIdAndUpdate(
                req.params.id,
                {name:req.body.name},
                {new:true}
            )
            if(!category){
                return res.status(404).send('The category with the givin ID was not found!')
            }
            res.send(category)
        }catch(err){
            console.log(err)
        }
    },

    async deleteCategory(req,res){
        try{
           const category = await Category.findByIdAndDelete(req.params.id)
           console.log("category:", category)
           if(!category){
            return res.status(404).send('The category with the givin ID was not found')
           }
           res.send('The category has been removed')
        }catch(err){
            console.log(err)
        }
    },

    async getCategoryById(req,res){
        try{
            console.log('id:',req.params.id)
            const category = await Category.findById(req.params.id)
            if(!category){
                return res.status(404).send('The category with the givin ID was not found')
            }
            console.log(category)
            res.send(category)
        }catch(err){
            console.log(err)
        }
    }
}