const nodemailer = require("nodemailer");
console.log("BREVO_EMAIL =", process.env.BREVO_EMAIL);
console.log("BREVO_KEY loaded =", !!process.env.BREVO_KEY);


const transporter = nodemailer.createTransport({

    host:"smtp-relay.brevo.com",

    port:587,
    secure:false,

    auth:{
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_KEY
    }

});


module.exports = transporter;