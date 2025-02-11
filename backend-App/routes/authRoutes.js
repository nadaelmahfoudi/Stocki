// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db.json'); 


router.post('/login', (req, res) => {
  const { secretKey } = req.body;
  const warehouseman = db.warehousemans.find(user => user.secretKey === secretKey);

  if (warehouseman) {
    return res.status(200).json({
      message: 'Authentication successful',
      user: {
        id: warehouseman.id,
        name: warehouseman.name,
        warehouseId: warehouseman.warehouseId
      }
    });
  } else {
    return res.status(401).json({ message: 'Invalid secretKey' });
  }
});

module.exports = router;
