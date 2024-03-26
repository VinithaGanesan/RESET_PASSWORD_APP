const express = require('express');
const router = express.Router({caseSensitive: true});

const { signUpUser, loginUser, forgotPassword, resetPassword, verifyUser, userLogout } = require('../controllers/usercontroller');

//signup new user
router.post('/signup', signUpUser);

//login new user
router.post('/login', loginUser);


//user forgot password 
router.post('/forgotpassword', forgotPassword);

//reset password
router.post('/resetpassword/:token', resetPassword);

// get verified for authorized user
router.get('/verify', verifyUser, (req, res) => {
    return res.json({
        success: true,
        message: "authorized user"
    })
});

// user logout
router.get('/logout', userLogout)


module.exports = router;