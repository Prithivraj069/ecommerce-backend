const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middleware/AuthenticatedWithJWT');


router.get('/', async (req, res)=> {
    try {
        res.send("get card route");

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
});

router.put('/', async (req, res) => {
    try {
        res.send("put cart route");

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

module.exports = router;