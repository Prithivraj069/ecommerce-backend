const pool = require('../database');

async function getAllProducts() {
    const [row] = await pool.query(`SELECT id, name, CAST(price AS DOUBLE) AS price, image FROM products`);
    return row;
}

async function getProductById(id) {
    const [row] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return row[0];
}


module.exports = {
    getAllProducts, 
    getProductById
};