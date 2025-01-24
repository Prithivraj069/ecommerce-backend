const cartData = require('../data/cartData');

async function getCartContent(userId) {
    return await cartData.getCartContent(userId);
}

async function updateCart(userId, cartItems) {
    if(!Array.isArray(cartItems)) {
        throw new Error('Cart items must be an array');
    }
    return await cartData.updateCart(userId,cartItems);

}


module.exports = {
    getCartContent,
    updateCart
}