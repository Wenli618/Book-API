const fs = require('fs')

module.exports = {
    fileUploader(file, location, filename){
        let ext = file.name.split('.').pop()
        ext = "." + ext.toLowerCase()
        const savedFilename = filename + '_' + Date.now() + ext
        const savedFilePath = location + savedFilename
        file.mv(savedFilePath)
        return savedFilePath
    },

    deleteFile(path){
        fs.unlink(path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return;
              }
            console.log('File deleted successfully')
        })
    },

    validateFile(file, maxSize, fileType){
        if(!file){
            return ({error:"No file uploaded"})
        }
        if(file.size > maxSize){
            return ({error:"The file is too large!"})
        }
        let ext = file.name.split('.').pop()
        ext = ext.toUpperCase()
      
        if(!fileType.includes(ext)){
            return ({error:`Only ${fileType.join('/')} types are allowed`})
        }
    }
}