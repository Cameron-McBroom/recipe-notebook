#!/usr/bin/env node

const pgtools = require("pgtools");
const {Pool} = require("pg");
const fs = require("fs");
require('dotenv').config();

const DATABASE_NAME="test-db"

const config = {
	user: process.env.SERVER_USER,
	password: process.env.SERVER_PASSWORD,
	host: 'localhost',
	port: process.env.PORT || 5432,
}

function createDB() {
	return new Promise((resolve, reject) => {
		pgtools.createdb(config, DATABASE_NAME, function (err, res) {
			if (err) {
				return reject(err)
			}
			return resolve(res)
		})
	})
}

function dropDB() {
	return new Promise((resolve, reject) => {
		pgtools.dropdb(config, DATABASE_NAME, function (err, res) {
			if (err) {
				return reject(err)
			}
			return resolve(res)
		})
	})
}

// MAIN
(async () => {
	try {
		const response = await createDB();
	}
	catch (err) {

		if (err.name === "duplicate_database") {

			console.log("Database already exists... Attempting to delete old database and reinitialise")

			try {
				await dropDB();
				console.log("Successfully dropped database")

				console.log("Attempting to recreate database")
				await createDB();
			}
			catch (err) {
				console.error(err);
				process.exit(-1);
			}
		}
		else {
			console.error(err);
			process.exit(-1);
		}
	}

	console.log("Database successfully created... setting up tables");

	const dataSql = fs.readFileSync(__dirname + "/database-setup.sql").toString();

	const pool = new Pool({
		user: process.env.SERVER_USER,
		password: process.env.SERVER_PASSWORD,
		host: "localhost",
		port: process.env.PORT || 5432,
		database: DATABASE_NAME
	});

	pool.query(dataSql, function(err, res) {
		pool.end();
		if (err) {
			console.log('error setting up tables: ', err);
			process.exit(-1);
		}
		console.log("Successfully set up tables!")
	})

})()








