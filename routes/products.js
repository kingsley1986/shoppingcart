var aws = require("aws-sdk");
var express = require("express");
const path = require("path");
const fs = require("fs");
var mongoose = require("mongoose");

const Product = require("../models/product");
const uploadPath = path.join("public", Product.productImageBasePath);

var router = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public");
	},
	filename: function (req, file, cb) {
		const uploadPathWithOriginalName =
			uploadPath + "/" + file.fieldname + "-" + Date.now();

		cb(null, file.fieldname + "-" + Date.now());
	},
});

var upload = multer({ storage: storage });

router.get("/new", function (req, res, next) {
	renderNewPage(res, new Product());
});

router.post("/create", upload.single("cover"), async (req, res, next) => {
	console.log(req);
	const product = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		image: req.file.filename,
	});
	try {
		const newProduct = await product.save();
		res.redirect("/products");
	} catch (error) {
		console.error(err);

		if (product.image != null) {
			try {
				fs.unlinkSync(path);
				//file removed
			} catch (err) {
				console.error(err);
			}
		}
		res.render("products/new");
	}
});

router.get("/", async (req, res) => {
	Product.find((err, products) => {
		res.render("products/index", {
			products: products,
		});
	});
});

router.get("/:id/", async (req, res) => {
	Product.findById(req.params.id, (err, product) => {
		res.render("products/show", {
			product: product,
		});
	});
});

router.get("/:id/edit", async (req, res) => {
	Product.findById(req.params.id, (err, product) => {
		res.render("products/edit", {
			product: product,
		});
	});
});

router.post("/:id/update", upload.single("cover"), async (req, res, next) => {
	Product.findById(req.params.id, function (err, product) {
		var path = product.image;
		if (req.file && fs.existsSync("public/" + path)) {
			try {
				fs.unlinkSync("public/" + path);

				let product2 = {};
				product2.name = req.body.name;
				product2.description = req.body.description;
				product2.price = req.body.price;
				product2.image = req.file.filename;
				let query = { _id: req.params.id };
				Product.updateOne(query, product2, (err, product) => {
					if (err) {
						console.log(err);
						res.redirect("back");
					} else {
						res.redirect("/products");
					}
				});
			} catch (e) {
				res.status(400).send({
					message: "Error deleting image!",
					error: e.toString(),
					req: req.body,
				});
			}
		} else if (req.file && !fs.existsSync("public/" + path)) {
			let product2 = {};
			product2.name = req.body.name;
			product2.description = req.body.description;
			product2.price = req.body.price;
			product2.image = req.file.filename;
			let query = { _id: req.params.id };
			Product.updateOne(query, product2, (err, product) => {
				if (err) {
					console.log(err);
					res.redirect("back");
				} else {
					res.redirect("/products");
				}
			});
		} else {
			let product2 = {};
			product2.name = req.body.name;
			product2.description = req.body.description;
			product2.price = req.body.price;
			product2.image = product2.image;
			let query = { _id: req.params.id };
			Product.updateOne(query, product2, (err, product) => {
				if (err) {
					console.log(err);
					res.redirect("back");
				} else {
					res.redirect("/products");
				}
			});
		}

		// res.s
	});
});

router.get("/:id/delete", async (req, res) => {
	Product.findById(req.params.id, function (err, product) {
		const ObjectId = mongoose.Types.ObjectId;

		let query = { _id: new ObjectId(req.params.id) };
		try {
			fs.unlinkSync("public/" + product.image);
			Product.deleteOne(query, async (err) => {
				res.redirect("/products");
			});
		} catch (e) {
			res.status(400).send({
				message: "Error deleting image!",
				error: e.toString(),
				req: req.body,
			});
		}
	});
});

async function renderNewPage(res, product, hasError = false) {
	try {
		const params = {
			product: product,
			layout: false,
		};
		if (hasError) params.errorMessage = "Error Creating product";
		res.render("products/new", params);
	} catch {
		res.redirect("/products");
	}
}
module.exports = router;
