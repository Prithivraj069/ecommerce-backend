const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/', async (req, res)=> {
   try {
    const products = await productService.getAllProducts();
    res.json(products);

   } catch (error) {
    res.status(500).json({
        message: error.message
    });
   }
});

router.get('/:id', async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

module.exports = router;