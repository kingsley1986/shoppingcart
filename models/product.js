var mongoose = require("mongoose");
const productImageBasePath = "uploads/productImages";

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
		// unique: true,
	},
	price: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	image: {
		type: String,
		required: true,
	},

	// user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
module.exports.productImageBasePath = productImageBasePath;
