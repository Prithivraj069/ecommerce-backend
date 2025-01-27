const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT= require('../middleware/AuthenticatedWithJWT');
const session = require('express-session');

// const app = express();
// app.use(session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {secure: false},
// }))

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

//logged out user
// router.post('/logout', (req, res) => {
 
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).send('Logout failed');
//       }
//       res.clearCookie('connect.sid'); // Clear session cookie
//       res.status(200).send('Logged out successfully');
//     });
//   });

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
        console.log(req.body);
        // todo: validate if all the keys in req.body exists
        if (!req.body.name || !req.body.email || !req.body.salutation || !req.body.marketingPreferences || !req.body.country) {
            return res.status(401).json({
                'error':'Invalid payload or missing keys'
            })
        }
        const userId = req.userId;
        await userService.updateUserDetails(userId, req.body);
        res.json({
            'message':'User details updated'
        })
        

    } catch (e) {   
        console.log(e);
        res.status(500).json({
            'message':'Internal server error'
        })

    } 
})


//delete logged in user function
router.delete('/me', AuthenticateWithJWT, async (req, res) => {
    try {
      await userService.deleteUserDetails(req.userId);
      res.json({
         'message': "User account deleted"
      })
    } catch (e) {
      console.log(e);
      res.status(500).json({
         'message':'Internal Server Error'
      })
    }
 })
 


module.exports = router;
