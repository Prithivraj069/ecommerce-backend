const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT= require('../middleware/AuthenticatedWithJWT');

//register new users function
router.post('/register', async (req, res) => {
    try {
        // const {name, email, password, salutation, marketingPreferences, country} = req.body;

        const userId = await userService.registerUser(req.body);
        res.json({message: "user registered successfully",userId});
    } catch (e) {
        res.status(400).json({message: e.message})
    }
});

//login user function
router.post('/login', async (req, res)=> {
    try {
        const {email, password} = req.body;
        const user = await userService.loginUser(email, password);

        if(user) {
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET, {expiresIn: '1h'});

            res.json({
                'message': 'logged in successful',
                token
            })
        } else {
            throw new Error("Unable to get user");
        }

    } catch (e) {
        res.status(400).json({
            'message': 'unable to login',
            'error':e.message
        })
    }
});

//get logged in user function
router.get('/me',AuthenticateWithJWT, async (req, res) => {
    try {
        const user = await userService.getUserDetailsById(req.userId);
        if(!user) {
            return res.status(404).json({message: 'user is not found'})
        }

        const {password, ...userWithOutPassword} = user;
        res.json({
            'user': userWithOutPassword
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//update or modify logged in user function
router.put('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        const user = req.body;

        if(!user.name || !user.email || !user.salutation || !user.marketingPreferences || !user.country) {
            return res.status(401).json({
                message: "invalid payload or missing keys"
            })
        }

        
        await userService.updateUserDetails(req.userId, req.body);
        res.json({
            'message': 'user details updated'
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            'message': 'Internal server error'
        })
    }

});

//delete logged in user function
router.delete('/me',AuthenticateWithJWT, async (req, res) => {
    try {
        //userId extracted from jwt
        await userService.deleteUserDetails(req.userId);
        res.json({
            'message': "User account deleted successfuly"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            'message':'Internal server error'
        })
    }
} )


module.exports = router;
