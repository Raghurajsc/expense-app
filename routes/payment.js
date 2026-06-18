const express = require("express");

const router = express.Router();


const paymentController = require("../controllers/paymentController");



// create order
router.post(
    "/create-order",
    paymentController.processPayment
);



// verify payment after checkout
router.get(
    "/verify/:orderId",
    paymentController.verifyPayment
);



module.exports = router;