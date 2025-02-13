const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the db.json file
const dbPath = path.join(__dirname, '../db.json');

// Function to read the db.json file and parse it
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

router.get('/products/:barcode', (req, res) => {
  try {
    // Read the db.json file
    const db = readDB();

    // Find the product by barcode
    const product = db.products.find(p => p.barcode === req.params.barcode);

    if (product) {
      res.json({
        exists: true,
        id: product.id,
        name: product.name,
        type: product.type,
        barcode: product.barcode,
        price: product.price,
        solde: product.solde,
        supplier: product.supplier,
        image: product.image,
        stocks: product.stocks,
        editedBy: product.editedBy
      });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error retrieving product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products', (req, res) => {
  try {
    // Read the db.json file
    const db = readDB();

    // Return the list of products
    res.status(200).json(db.products);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
