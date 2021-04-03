const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');


router.route('/signup')
    .post(userController.userSignup)

// create token to client
router.route('/login')
    .post(userController.userLogin)

router.route('/:userId')
    .delete(checkAuth,userController.deleteUser)



module.exports = router;