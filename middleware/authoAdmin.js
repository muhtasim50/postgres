const pool = require('../db')

const authoAdmin = async (req, res, next) => {
    try {
        
    } catch (err) {
        return res.status(500).json({msg : err.message})
    }
}

module.exports = authoAdmin