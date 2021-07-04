const {Pool} = require("pg");
require('dotenv').config();


const pool = new Pool({
	user: "client",
	password: "client",
	host: "localhost",
	port: process.env.PORT || 5432,
	database: "perntodo"
});


module.exports = pool;
