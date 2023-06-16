const { host } = require('pg/lib/defaults');

const Pool = require('pg').Pool;

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "school",
    password: "password",
    port: 5432,
});

module.exports = pool;