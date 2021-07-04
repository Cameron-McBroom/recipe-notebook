require('dotenv').config();
const express = require("express");
const app = express();
let passport = require('passport');
const session = require("express-session");
const cors = require("cors");
const pgSession = require('connect-pg-simple')(session)
const pool = require("./db");
let routes = require('./routes');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * -------------- SESSION SETUP ----------------
 */

const store = new pgSession({ conString: "postgres://client:client@localhost:5432/perntodo"})

app.use(session({
	store: store,
	secret: process.env.SECRET,
	resave: false,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());


app.use(routes)



app.listen(5000, () => {
	console.log("sever started on port 5000")
})
