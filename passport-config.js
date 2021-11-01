// const localStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcrypt");

// function initialize(passport, getUserByEmail) {
// 	const authenticationUser = async (email, password, done) => {
// 		const user = getUserByEmail(email);

// 		if (user === null) {
// 			return done(nul, false, { message: "No user with that email" });
// 		}
// 		try {
// 			if (await bcrypt.compare(password, user.password)) {
// 				return done(null, user);
// 			} else {
// 				return done(nul, false, { message: "Password incorrect" });
// 			}
// 		} catch (error) {
// 			return done(error);
// 		}
// 	};
// 	passport.use(
// 		new localStrategy({ usernameField: "email" }, authenticationUser)
// 	);
// 	passport.serializeUser((user, done) => {});
// 	passport.serializeUser((id, done) => {});
// }

// module.exports = initialize;
