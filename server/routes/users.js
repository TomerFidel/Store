var express = require('express');
var db = require('../config/db');
var router = express.Router();
var registerValidation = require('../middleware/form_validation/register');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var con = db.getPool();

router.post('/', registerValidation.validate, function(req, res, next) {
	// User registration
	
	const {tz, first_name, last_name, username, email, password, city, street} = req.body;
	let hashed_password = bcrypt.hashSync(password, 10);
	let token = jwt.sign({ username: username }, secret.key);
	let q = `INSERT INTO users
			(tz, first_name, last_name, username, email, password, city, street, role, token)
			VALUES
			(?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`;

	let entries = [tz, first_name, last_name, username, email, hashed_password, city, street, token];
	con.query(q, entries, function(err) {
		if (err) if (err) return res.status(500).end(); // DB connection error

		let data = {
			user: {
				tz: tz,
				username: username,
				email: email
			},
			token: token
		}
		res.status(201).json(data);
	});
});

router.get('/:tz/', function(req, res, next) {
	const tz = req.params.tz;

	let q = "SELECT tz, first_name, last_name, username, email, city, street FROM `users` WHERE tz = ? LIMIT 1";
	let entries = [tz];

	con.query(q, entries, function (err, result) {
		if (err) return res.status(500).end(); // DB Connection error

		if (result.length == 0) return res.status(404).end(); // User not found

		let data = {
			user: result[0]
		};
		return res.json(data);
	})
});

module.exports = router;
