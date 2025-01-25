const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');
const authenticateToken = require('../middleware/UserAuth');


router.use(authenticateToken);

router.get('/', async (req, res)=> {
    try {
        const cartContents = await CartService.getCartContent(req.user.userId);
        res.json(cartContents);

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
});

router.put('/', async (req, res) => {
    try {
        const cartItems = req.body.cartItems;
        await CartService.updateCart(req,user.userId, cartItems);
        res.json({message: " cart updated successfully"});

    } catch (e) {
        res.status(400).json({
            message: e.message
        })
    }
})

module.exports = router;