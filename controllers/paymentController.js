const { createOrder } = require("../services/cashfreeService");

const Payment = require("../models/payment");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const User = require("../models/user");



exports.processPayment = async (req, res) => {

    try {

        const userId = req.query.userId;


        const orderId = "premium-" + Date.now();


        const amount = 499;


        const currency = "INR";


        const customerId = "user-" + userId;


        const customerPhone = "9999999999";



        const order =
        await createOrder(
            orderId,
            amount,
            currency,
            customerId,
            customerPhone
        );



        await Payment.create({

            orderId: order.order_id,

            paymentSessionId:
            order.payment_session_id,

            amount: amount,

            status:"PENDING",

            userId:userId

        });



        res.json({

            success:true,

            paymentSessionId:
            order.payment_session_id,

            orderId:
            order.order_id

        });


    }
    catch(err){

        console.log("FULL ERROR:", err);


        res.status(500).json({

            success:false,

            message: err.message,
            error: err.response?.data || err

        });

    }

};






// VERIFY PAYMENT AFTER CASHFREE PAYMENT

exports.verifyPayment = async(req,res)=>{


    try{


        const orderId = req.params.orderId;



        const cashfree = new Cashfree(

            CFEnvironment.SANDBOX,

            process.env.CASHFREE_APP_ID,

            process.env.CASHFREE_SECRET_KEY

        );



        const response =
        await cashfree.PGOrderFetchPayments(orderId);



        const status =
        response.data[0].payment_status;



        const payment =
        await Payment.findOne({

            where:{
                orderId:orderId
            }

        });



        if(!payment){

            return res.json({

                success:false,

                message:"Payment not found"

            });

        }



        if(status === "SUCCESS"){


            payment.status="SUCCESS";

            await payment.save();



            const user =
            await User.findByPk(payment.userId);



            user.isPremium=true;


            await user.save();



            return res.json({

                success:true,

                message:"Transaction successful"

            });


        }
        else{


            payment.status="FAILED";


            await payment.save();



            return res.json({

                success:false,

                message:"TRANSACTION FAILED"

            });


        }



    }
    catch(err){

        console.log(
          "VERIFY ERROR 👉",
          err.response?.data || err
        );


        res.status(500).json({

            success:false,

            message: err.message,

            error: err.response?.data || err

        });

    }

};