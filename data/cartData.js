const pool = require('../database');

async function getCartContent(userId) {
    const [rows] = await pool.query(`
        SELECT c.id, 
               c.product_id, 
               p.image AS imageUrl, 
               p.name AS productName,
               CAST(price AS DOUBLE) AS price,
               c.quantity 
               FROM cart_items AS c JOIN products AS p
          ON c.product_id = p.id
          WHERE user_id = ?
        `, [userId]);


    return rows;
}

async function updateCart(userId, cartItem) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(`
            DELETE FROM cart_items WHERE user_id = ?
            `, [userId]);

        for(let item of cartItem) {
            await connection.query(`
                INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
                `, [userId, item.product_id, item.quantity]);
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release()
    }
}

module.exports = {
    getCartContent,
    updateCart
}