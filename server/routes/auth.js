var express = require('express');
var db = require('../config/db');
var router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var con = db.getPool();

router.post('/', function (req, res, next) {
    const { username, password } = req.body;

    let q = "SELECT password, token FROM `users` WHERE username = ? LIMIT 1";
    let entries = [username];

    con.query(q, entries, function (err, result) {
        if (err) return res.status(500).end();

        if (result.length == 0 || !bcrypt.compareSync(password, result[0].password)) return res.status(401).end();

        let data = {
            token: result[0].token
        }

        res.json(data);
    })
});

// router.get('/', function (req, res, next) {
//     const { token } = req.body;
//     let username = "";
//     try {
//         username = jwt.verify(token, secret.key).username;
//     } catch (err) {
//         response.setError("Wrong token!!!!!!!");
//         res.json(response);
//         return;
//     }

//     let q = "SELECT tz FROM `users` WHERE username = ? LIMIT 1";
//     let entries = [username];

//     con.query(q, entries, function (err, result) {
//         if (err) {
//             response.setError("Could not connect to the DB");
//             res.json(response);
//             return;
//         }

//         response.setSuccess("Authentication completed");
//         response.data = {
//             authenticated: (result.length == 1)
//         }
//         res.json(response);
//     })
// });

module.exports = router;
