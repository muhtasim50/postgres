// const { password } = require('pg/lib/defaults')
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtGenerator = require('../utils/jwtGenerator')
const refreshGenerator = require('../utils/refreshGenerator')

const userCtrl = {
    register: async (req, res) => {
        let { name, guardName, email, password } = req.body;

        let dataSample = { name: name, guardName: guardName, email: email }

        let errorSample = { errorCode: 0, errorMessage: "" };
        let sample = { error: [errorSample], data: [dataSample] };

        let i = 0;

        if (name.length == 0) {
            sample.error[i] = { errorCode: 101, errorMessage: "Your Name required..." }
            i++;
        }

        if (!guardName) {
            sample.error[i] = { errorCode: 102, errorMessage: "Guardian Name required..." }
            i++;
        }

        if (email.length == 0) {
            sample.error[i] = { errorCode: 103, errorMessage: "Email required..." }
            i++;
        }

        if (!password || password.length < 6) {
            sample.error[i] = { errorCode: 104, errorMessage: "Password length should be atleast 6..." }
            i++;
        }

        console.log(
            "test",
            req.body
        );

        let errors = [];

        if (sample.error[0].errorCode !== 0) return res.json({ sample })


        pool.query(`SELECT * FROM userinfos where email = $1`, [email], async (err, results) => {
            if (err) throw err;

            const passwordhash = await bcrypt.hash(password, 10)

            if (results.rows.length > 0) {
                sample.error[i] = { errorCode: 105, errorMessage: "the email already exist" }
                return res.json({ sample })
            }



            pool.query(`INSERT INTO userinfos (name, guardName, email, password)
                        VALUES ($1, $2, $3, $4) RETURNING id, password`, [name, guardName, email, passwordhash], (er, reslt) => {
                if (er) throw er;

                // authentication

                const accesstoken = jwtGenerator(reslt.rows[0].id)
                const refreshtoken = refreshGenerator(reslt.rows[0].id)

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token'
                })

                res.json({ sample, accesstoken, refreshtoken })


            })


        })


    },
    login: async (req, res) => {
        try {
            let { email, password } = req.body;

            let dataSample = { email: email }
            let errorSample = { errorCode: 0, errorMessage: "" };
            let sample = { error: [errorSample], data: [dataSample] };

            let i = 0;

            if (email.length == 0) {
                sample.error[i] = { errorCode: 103, errorMessage: "Email required..." }
                i++;
            }
            if (!password || password.length < 6) {
                sample.error[i] = { errorCode: 104, errorMessage: "Password length should be atleast 6..." }
                i++;
            }

            console.log(
                "test",
                req.body
            );

            if (sample.error[0].errorCode !== 0) return res.json({ sample })



            pool.query(`SELECT * FROM userinfos where email = $1`, [email], async (err, results) => {
                if (err) throw err;

                if (results.rows.length == 0) {
                    sample.error[i] = { errorCode: 106, errorMessage: "the user does not exist" }
                    i++;
                    return res.json({ sample })
                } 
                else {
                    sample.error[i] = { errorCode: "No Error", errorMessage: "the user exist" }
                    i++;
                }

                const isMatch = await bcrypt.compare(password, results.rows[0].password);

                if (!isMatch) {
                    sample.error[i] = { errorCode: 107, errorMessage: "incorrect password" }
                    i++;
                    return res.json({ sample })
                }



                const accesstoken = jwtGenerator(results.rows[0].id)
                const refreshtoken = refreshGenerator(results.rows[0].id)

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token'
                })

                res.json({ sample, accesstoken, refreshtoken })



            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login or register" })

            jwt.verify(rf_token, process.env.refreshSecret, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" })

                let { id } = user.user;

                const accesstoken = jwtGenerator(user.user)

                res.json({ user, accesstoken })
                // res.json(user.user)
            })

            // res.json({ rf_token })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            let { id } = req.user.user

            pool.query(`SELECT * FROM userinfos where id = $1`, [req.user.user], async (err, resultss) => {
                if (err) throw err;

                // if(results.rows.length == 0) return res.status(400).json({msg: "the user does not exist"})

                res.json(resultss.rows)

            })
            // const user =  pool.query(`SELECT * FROM userinfos where id = $1`, [id])
            // if(!user) return res.status(400).json({ msg: "user does not exist"})

            // res.json( user.rows )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = userCtrl;