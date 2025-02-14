const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (db) => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

router.get('/products/:barcode', (req, res) => {
  try {
    const product = readDB().products.find(p => p.barcode === req.params.barcode);
    res.json(product ? { exists: true, product } : { exists: false });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/stocks/:productId/:stockId', (req, res) => {
  const { productId, stockId } = req.params;
  const { quantityChange } = req.body;

  if (isNaN(quantityChange)) {
    return res.status(400).json({ error: 'Quantity change must be a number' });
  }

  try {
    const db = readDB();
    const product = db.products.find(p => p.id === parseInt(productId));

    if (product) {
      const stock = product.stocks.find(s => s.id === parseInt(stockId));

      if (stock) {
        stock.quantity += quantityChange;
        writeDB(db);
        res.status(200).json({ message: 'Stock updated successfully' });
      } else {
        res.status(404).json({ message: 'Stock not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/products', (req, res) => {
  try {
    res.status(200).json(readDB().products);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
