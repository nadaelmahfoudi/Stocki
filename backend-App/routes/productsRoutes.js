const express = require('express');
const router = express.Router();
const db = require('../db.json');

router.get('/products', (req, res) => {
    res.status(200).json(db.products);
});

module.exports = router;
