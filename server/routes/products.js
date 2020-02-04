var express = require('express');
var db = require('../config/db');
var httpResponse = require('../modules/httpResponse');
var router = express.Router();

var con = db.getPool();

/* GET home page. */
router.post('/', function (req, res, next) {
	// add new product
	const { name, category_id, price, image } = req.body;
	let q = `INSERT INTO products
			(name, category_id, price, image)
			VALUES
			(?, ?, ?, ?)`;

	let entries = [name, category_id, price, image];
	con.query(q, entries, function (err, result) {
		if (err) return res.status(500).end();

		let data = {
			product: {
				id: result.insertId,
				name: name,
				category_id: category_id,
				price: price,
				image: image
			}
		}
		res.status(201).json(data);
	});
});

router.put('/:id/', function (req, res, next) {
	// edit existing product
	let id = req.params.id;

	let q = "SELECT * FROM `products` WHERE `id` = ?";
	let entries = [id];
	con.query(q, entries, function (err, result) {
		if (err) return res.status(500).end();

		if (result.length == 0) res.status(404).end();
		
		const { name, category_id, price, image } = req.body;
		q = "UPDATE `products` SET name = ?, category_id = ?, price = ?, image = ? WHERE id = ?";
		entries = [name, category_id, price, image, id];
		con.query(q, entries, function (err, result) {
			if (err) return res.status(500).end();

			let data = {
				product: {
					id: id,
					name: name,
					category_id: category_id,
					price: price,
					image: image
				}
			}
			res.json(data);
		});
	});
	
});

router.get('/', function (req, res, next) {
	// get all products / get products by search query
	const search_query = req.query.q ? ` WHERE name LIKE ?` : "";

	let q = "SELECT * FROM `products`" + search_query;
	let entries = req.query.q ? ['%' + req.query.q + '%'] : [];
	con.query(q, entries, function (err, result) {
		if (err) return res.status(500).end();

		if (result.length == 0) return res.status(404).end();

		let data = {
			products: result
		};
		res.json(data);
		return;
	})

});

module.exports = router;
