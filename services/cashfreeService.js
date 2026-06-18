const { Cashfree, CFEnvironment } = require("cashfree-pg");


console.log("APP ID:", process.env.CASHFREE_APP_ID);
console.log("SECRET:", process.env.CASHFREE_SECRET_KEY);


const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env. CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);



exports.createOrder = async(
    orderId,
    amount,
    currency,
    customerId,
    phone
)=>{


    const request = {

        order_amount: amount,

        order_currency: currency,

        order_id: orderId,


        customer_details: {

            customer_id: customerId,

            customer_phone: phone

        },


        order_meta: {

            return_url:
            "http://localhost:3000/payment-success?order_id={order_id}"

        }

    };


    const response =
    await cashfree.PGCreateOrder(request);


    return response.data;

}