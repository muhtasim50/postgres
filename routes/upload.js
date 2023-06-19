const router = require('express').Router()
const cloudinary = require('cloudinary')
const autho = require('../middleware/autho')
const authoAdmin = require('../middleware/authoAdmin')
const fs = require('fs')


cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_api_key, 
    api_secret: process.env.cloud_api_secret 
  });

router.post('/upload',autho, authoAdmin, (req, res) => {
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length == 0) return res.status(400).json({msg: "No files were uploaded"})

        const file = req.files.file;

        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "file size is too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "file format not supported"})
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "school"}, async (err, result) => {
            if(err) throw err;

            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })
      
    } catch (err) {
        return res.status(500).json({msg: err.msg})
    }
})

router.post('/destroy', autho, authoAdmin, (req, res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: "No images selected"})

        cloudinary.v2.uploader.destroy(public_id, async (err, result) =>{
            if(err) throw err;

            res.json({msg: "Deleted the Image"})
        })
    } catch (err) {
        return res.status(500).json({msg: err.msg})
    }
    
})

const removeTmp = (path) =>{
    fs.unlink(path, err =>{
        if(err) throw err;
    })
}

module.exports = router