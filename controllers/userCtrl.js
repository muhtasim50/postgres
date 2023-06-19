// const { password } = require('pg/lib/defaults')
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtGenerator = require('../utils/jwtGenerator')
const refreshGenerator = require('../utils/refreshGenerator')

const userCtrl = {
    register: async (req, res) =>{
        let {name, guardName, email, password} = req.body;
        if(password.length < 6) return res.status(400).json({msg: "password length should be at least 6"})

        console.log({
            name,
            guardName,
            email,
            password
        });

        let errors = [];


        pool.query(`SELECT * FROM userinfos where email = $1`, [email], async (err, results) => {
            if(err) throw err;
            
            if(results.rows.length > 0) return res.status(400).json({msg: "the email already exist"})

            const passwordhash = await bcrypt.hash(password, 10)

            pool.query(`INSERT INTO userinfos (name, guardName, email, password)
                        VALUES ($1, $2, $3, $4) RETURNING id, password`, [name, guardName, email, passwordhash], (er, reslt) => {
                            if(er) throw er;

                            // authentication

                            const accesstoken = jwtGenerator(reslt.rows[0].id)
                            const refreshtoken = refreshGenerator(reslt.rows[0].id)

                            res.cookie('refreshtoken', refreshtoken, {
                                httpOnly: true,
                                path: '/user/refresh_token'
                            })

                            res.json({ accesstoken, refreshtoken })

                            // res.json({password, passwordhash})
                        })
            
        })

    },
    login: async (req, res) => {
        try {
            let {email, password} = req.body;

            pool.query(`SELECT * FROM userinfos where email = $1`, [email], async (err, results) => {
                if(err) throw err;
                
                if(results.rows.length == 0) return res.status(400).json({msg: "the user does not exist"})

                const isMatch = await bcrypt.compare(password, results.rows[0].password);

                if(!isMatch) return res.status(400).json({msg: "incorrect password"});

                // res.json({ msg: "Successful LOGIN"})

                const accesstoken = jwtGenerator(results.rows[0].id)
                const refreshtoken = refreshGenerator(results.rows[0].id)

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token'
                })

                res.json({ accesstoken, refreshtoken })
    
                
            })

            // const user = pool.query(`SELECT * FROM userinfos where email = $1`, [email]);

            // if(user.rows.length < 1) return res.status(400).json({msg: "the user does not exist"})

            // const isMatch = await bcrypt.compare(password, user.rows[0].password);

            // if(!isMatch) return res.status(400).json({msg: "incorrect password"});

            // res.json({ msg: "Successful LOGIN"})

            
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({ msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    },
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({ msg: "Please login or register"})

            jwt.verify(rf_token, process.env.refreshSecret, (err, user) => {
                if(err) return res.status(400).json({ msg: "Please login or register"})

                let {id} = user.user;

                const accesstoken = jwtGenerator(user.user)

                res.json({ user, accesstoken })
                // res.json(user.user)
            })

            // res.json({ rf_token })

        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
        
    },
    getUser: async (req, res) => {
        try {
            let {id} = req.user.user

            pool.query(`SELECT * FROM userinfos where id = $1`, [req.user.user], async (err, resultss) => {
                if(err) throw err;
                
                // if(results.rows.length == 0) return res.status(400).json({msg: "the user does not exist"})

                res.json( resultss.rows )

            })
            // const user =  pool.query(`SELECT * FROM userinfos where id = $1`, [id])
            // if(!user) return res.status(400).json({ msg: "user does not exist"})
            
            // res.json( user.rows )
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    }
}

module.exports = userCtrl;