const pool = require('../db')


const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            res.json('Category test control')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async (req, res) => {
        try {
            let {deptName} = req.body;
            pool.query(`SELECT * FROM departments where deptName = $1`, [deptName], async (err, results) => {
                if(err) throw err;
                
                if(results.rows.length > 0) return res.status(400).json({msg: "the department already exist"})

                await pool.query(`INSERT INTO departments (deptName)
                        VALUES ($1)`, [deptName])
                
                res.json('Created Department')

            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})            
        }
    }
}

module.exports = categoryCtrl