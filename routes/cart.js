const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');
// const authenticateToken = require('../middleware/UserAuth');
const AuthenticateWithJWT = require('../middleware/AuthenticatedWithJWT');

// router.use(authenticateToken);

router.get('/', AuthenticateWithJWT, async (req, res)=> {
    try {
        const cartContents = await CartService.getCartContent(req.userId);
        res.json(cartContents);

    } catch (e) {
        res.status(500).json({
            message: "Error retriving cart"
        })
    }
});

router.put('/',AuthenticateWithJWT, async (req, res) => {
    try {
        const cartItems = req.body.cartItems;
        await CartService.updateCart(req.userId, cartItems);
        res.json({message: " cart updated successfully"});

    } catch (e) {
        res.status(500).json({
            message: "Error updating shopping cart"
        })
    }
})

module.exports = router;