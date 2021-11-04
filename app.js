if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");

// const db = require("./config/keys.js").MongoURI;
require("./config/passport")(passport);

var app = express();

try {
	mongoose.connect(
		process.env.MONGODB_URI || process.env.DATABASE_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		() => console.log("connected")
	);
} catch (error) {
	console.log("could not connect");
}

// view engine setup
app.use(expressLayouts);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(passport.initialize());

// app.use(passport.session());

app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
