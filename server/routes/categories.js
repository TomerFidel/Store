var express = require('express');
var db = require('../config/db');
var router = express.Router();

var con = db.getPool();

router.get('/:id/products/', function (req, res, next) {
    // get products by category id
    const id = req.params.id;

    let q = "SELECT * FROM `products` WHERE `category_id` = ?";
    let entries = [id];
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
