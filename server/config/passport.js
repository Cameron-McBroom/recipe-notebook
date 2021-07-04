const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {validPassword} = require("../lib/passwordUtils")
const pool = require("../db")

const customFields = {
	usernameField: "email",
	passwordField: "password"
}

const verifyCallback = async (username, password, done) => {

	try {
		const queryResult = await pool.query(
			"SELECT email, password, salt FROM user_account WHERE email = $1", [username]);

		const user = queryResult.rows[0]

		if (!user)
			return done(null, false)

		console.log(user);

		const isValid = validPassword(password, user.password, user.salt);

		return isValid ? done(null, user) : done(null, false);
	}
	catch (error) {
		done(error)
	}
}

const strategy = new LocalStrategy(customFields, verifyCallback)

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user.email);
})

passport.deserializeUser(async (userId, done) => {

	try {
		const queryResult = await pool.query(
			"SELECT * FROM user_account WHERE email = $1", [userId]);

		const user = queryResult.rows[0]

		user ? done(null, user) : done(null, false)
	}
	catch(error) {
		done(err)
	}


})
