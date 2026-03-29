const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createRazorpayOrder,
    verifyPaymentSignature,
    getConfig
} = require('../controllers/paymentController');

router.route('/config').get(protect, getConfig);
router.route('/create-order').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyPaymentSignature);

module.exports = router;
