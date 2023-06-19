const pool = require('../db')


const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            await pool.query(`SELECT * FROM departments`, async (err, results) => {
                if(err) throw err;
                
                if(results.rows.length == 0) return res.status(400).json({msg: "currently no department exists"})

                
                res.json( results.rows )

            })
            // res.json('Category test control')
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
    },
    deleteCategory: async (req, res) => {
        try {
            let {deptName} = req.body;
            // console.log(deptName)
            pool.query(`SELECT * FROM departments where deptName = $1`, [deptName], async (err, results) => {
                if(err) throw err;
                
                if(results.rows.length == 0) return res.status(400).json({msg: "the department does not exist"})

                await pool.query(`DELETE FROM departments WHERE deptName = $1;`, [deptName])
                
                res.json('Deleted the Department')

            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl