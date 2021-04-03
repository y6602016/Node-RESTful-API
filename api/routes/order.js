const express = require('express');
const router = express.Router();
// checkAuth to protect routes
const checkAuth = require('../middleware/check-auth');

const orderController = require('../controllers/order');

router.route('/')
    .get(checkAuth, orderController.getOrder)
    .post(checkAuth, orderController.submitOrder)

router.route('/:orderId')
    .get(checkAuth, orderController.getOrderId)
    .delete(checkAuth, orderController.deleteOrder)

module.exports = router;