const pool = require('../db')

const authoAdmin = async (req, res, next) => {
    try {
        pool.query(`SELECT * FROM userinfos where id = $1`, [req.user.user], async (err, resultss) => {
            if(err) throw err;
            
            // if(results.rows.length == 0) return res.status(400).json({msg: "the user does not exist"})

            // res.json( resultss.rows )

            if(resultss.rows[0].role == 0) 
                return res.status(400).json({msg: "Resources access denied"})

            next();

        })
    } catch (err) {
        return res.status(500).json({msg : err.message})
    }
}

module.exports = authoAdmin