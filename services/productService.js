const productData = require('../data/productData');

async function getAllProducts() {
    return await productData.getAllProducts();
}

async function getProductById(id) {
  const productbyId = await productData.getProductById(id);
  
  if(!productbyId) {
    throw new Error('Product is not found');
  }
  return productbyId;
}

module.exports = {
    getAllProducts,
    getProductById
}