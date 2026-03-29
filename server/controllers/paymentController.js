const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

// Initialize Razorpay SDK
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret',
    });
};

// @desc    Create a razorpay order instance
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Invalid payment amount');
    }

    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in subunits (paise)
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${req.user._id}`,
    };

    try {
        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create(options);
        
        if (!order) {
            res.status(500);
            throw new Error('Some error occured creating Razorpay order');
        }

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500);
        throw new Error(error.error?.description || 'Could not instantiate payment. Check your API Keys.');
    }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPaymentSignature = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret';

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
        res.status(400);
        throw new Error('Payment signature verification failed. Transaction is considered invalid.');
    }

    // Payment is verified
    res.json({
        success: true,
        message: 'Payment verified successfully'
    });
});

// @desc    Get Razorpay Key ID
// @route   GET /api/payment/config
// @access  Private
const getConfig = asyncHandler(async (req, res) => {
    res.json({
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id'
    });
});

module.exports = {
    createRazorpayOrder,
    verifyPaymentSignature,
    getConfig
};
