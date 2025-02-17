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

router.post('/products', (req, res) => {
  const { name, type, barcode, price, solde, supplier, image, stocks, editedBy } = req.body;

  if (!name || !type || !barcode || !price || !solde || !supplier || !image || !stocks) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = readDB();
    const newProductId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
    const updatedStocks = stocks.map((stock, index) => ({
      id: newProductId * 1000 + index + 1,
      name: stock.name,
      quantity: stock.quantity,
      localisation: stock.localisation
    }));

    const newProduct = {
      id: newProductId,
      name,
      type,
      barcode,
      price,
      solde,
      supplier,
      image,
      stocks: updatedStocks,
      editedBy: editedBy || [] 
    };

    db.products.push(newProduct);
    writeDB(db);

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error('Error adding product:', err);
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

router.get('/statistics/:warehouseId', (req, res) => {
  try {
    const db = readDB();
    const products = db.products;
    const warehouseId = req.params.warehouseId;

    const filteredProducts = products.filter(p => 
      p.editedBy.some(edit => edit.warehousemanId == warehouseId) 
    );

    console.log('Filtered Products:', filteredProducts);  
    const totalProducts = filteredProducts.length;

    const outOfStock = filteredProducts.filter(p => 
      p.stocks.every(stock => stock.quantity === 0)
    ).length;

    const totalStockValue = filteredProducts.reduce((sum, product) => {
      const stockValue = product.stocks.reduce((stockSum, stock) => {
        const stockAmount = stock.quantity * (stock.value || 0); 
        return stockSum + stockAmount;
      }, 0);
      return sum + stockValue;
    }, 0);
    const mostAddedProducts = filteredProducts
      .map(p => ({
        name: p.name,
        addedCount: p.stocks.reduce((count, stock) => count + (stock.addedCount || 0), 0) 
      }))
      .sort((a, b) => b.addedCount - a.addedCount);
    const mostRemovedProducts = filteredProducts
      .map(p => ({
        name: p.name,
        removedCount: p.stocks.reduce((count, stock) => count + (stock.removedCount || 0), 0) 
      }))
      .sort((a, b) => b.removedCount - a.removedCount);

    res.status(200).json({
      totalProducts,
      outOfStock,
      totalStockValue,
      mostAddedProducts,
      mostRemovedProducts,
      products: filteredProducts, 
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
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
