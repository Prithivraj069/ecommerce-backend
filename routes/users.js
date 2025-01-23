const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    res.json({message: 'Register new user'})
});

router.post('/login', (res, req)=> {
    res.json({message: 'login a user'});
})


module.exports = router;
