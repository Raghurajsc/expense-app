const express = require("express");

const router = express.Router();

const User = require("../models/user");

const transporter = require("../util/sendMail");



router.post("/forgotpassword", async(req,res)=>{


try{


const {email}=req.body;



const user = await User.findOne({
    where:{
        email:email
    }
});



if(!user){

return res.status(404).json({
message:"User not found"
});

}




await transporter.sendMail({

from:"raghurajsc562@gmail.com",

to:email,

subject:"Forgot Password",

text:
"Hello user, click here to reset your password."

});



res.status(200).json({

message:"Reset mail sent successfully"

});



}

catch(err){

console.log(err);

res.status(500).json({
message:"Something went wrong"
});

}


});



module.exports = router;