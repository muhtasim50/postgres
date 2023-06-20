const pool = require('../db')

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            pool.query(`SELECT * FROM notices`, async (err, resultss) => {
                if (err) throw err;

                res.json(resultss.rows)
            })
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    },
    createProduct: async (req, res) => {
        try {
            let { noticeID, noticeTITLE, deptName, images } = req.body;
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