const pool = require('../db')

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    },
    createProduct: async (req, res) => {
        try {
            
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    },
    deleteProduct: async (req, res) => {
        try {
            
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    },
    updateProduct: async (req, res) => {
        try {
            
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    }

}

module.exports = productCtrl