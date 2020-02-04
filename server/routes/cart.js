var express = require('express');
var db = require('../config/db');
var router = express.Router();

var con = db.getPool();

router.post('/', function (req, res, next) {
  // get products by category id
  const { user_id } = req.body;

  let q = "INSERT INTO `cart` (`user_id`) VALUES (?)";
  let entries = [user_id];
  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();
    
  })
});

router.post('/:id/', function (req, res, next) {
  const id = req.params.id;
  const { product_id, quantity, price } = req.body;

  let q = "INSERT INTO `cart_products` (`cart_id`, `product_id`, `quantity`, `price`) VALUES (?, ?, ?, ?)";
  let entries = [id, product_id, quantity, price];
  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();

  })
});

router.patch('/:id/products/:product_id/', function (req, res, next) {
  // get products by category id
  const id = req.params.id;
  const product_id = req.params.product_id;
  const { quantity, price } = req.body;

  let q = "UPDATE `cart_products` SET `quantity` = ?, `price` = ? WHERE cart_id = ? AND product_id = ?";
  let entries = [quantity, price, id, product_id];
  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();

  })
});

router.get('/:id/products/', function (req, res, next) {
  // get products by category id
  const id = req.params.id;

  let q = "SELECT * FROM `cart_products` WHERE `cart_id` = ?";
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

router.delete('/:id/', function (req, res, next) {
  // get products by category id
  const id = req.params.id;

  let q = "DELETE FROM `cart_products` WHERE `cart_id` = ?";
  let entries = [id];
  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();
  })
});

router.delete('/:id/products/:product_id/', function (req, res, next) {
  // get products by category id
  const id = req.params.id;
  const product_id = req.params.product_id;

  let q = "DELETE FROM `cart_products` WHERE `cart_id` = ? AND `product_id` = ?";
  let entries = [id, product_id];
  con.query(q, entries, function (err, result) {
    if (err) return res.status(500).end();

    return res.status(204).end();
  })
});

module.exports = router;
