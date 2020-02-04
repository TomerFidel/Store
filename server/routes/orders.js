var express = require('express');
var db = require('../config/db');
var router = express.Router();

var con = db.getPool();

router.post('/', function (req, res, next) {
  // get products by category id
  const { client_id, cart_id, final_price, delivery_city, delivery_street, delivery_date, cr_card_num } = req.body;

  let q = `
    INSERT INTO orders
    (client_id, cart_id, price, delivery_city, delivery_street, delivery_date, cr_card_num)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
  `;
  let entries = [client_id, cart_id, final_price, delivery_city, delivery_street, delivery_date, cr_card_num];

  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();
  })
});

router.get('/', function (req, res, next) {

  let q = "SELECT COUNT(*) cnt FROM `orders`";

  con.query(q, function (err, result) {
    if (err) return res.status(500).end();

    let data = {
      orders: result[0].cnt
    };
    res.json(data);
    return;
  })
});


module.exports = router;
