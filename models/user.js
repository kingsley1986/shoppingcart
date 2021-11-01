var mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		// unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},

	// eventcomments: [{ type: Schema.Types.ObjectId, ref: "Eventcomment" }],
});

module.exports = mongoose.model("User", userSchema);
// module.exports.eventImageBasePath = eventImageBasePath;
