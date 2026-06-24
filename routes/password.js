const express = require("express");
const router = express.Router();

const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");

const transporter = require("../util/sendMail");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");



// FORGOT PASSWORD

router.post("/forgotpassword", async(req,res)=>{

    try{

        const {email} = req.body;


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



        const requestId = uuidv4();



        await ForgotPasswordRequest.create({

            id:requestId,
            userId:user.id,
            isactive:true

        });




        const resetUrl =
        `http://localhost:3000/password/resetpassword/${requestId}`;



        await transporter.sendMail({

            from:"raghurajsc562@gmail.com",

            to:email,

            subject:"Forgot Password",

            text:
`Click here to reset password:

${resetUrl}`

        });





        res.status(200).json({

            message:"Reset mail sent successfully",

            resetUrl:resetUrl

        });



    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Something went wrong"
        });

    }

});








// RESET PASSWORD PAGE

router.get("/resetpassword/:id", async(req,res)=>{


    try{


        const id = req.params.id;



        const request = await ForgotPasswordRequest.findOne({

            where:{
                id:id
            }

        });



        if(!request){

            return res.send("Invalid reset link");

        }



        if(request.isactive === false){

            return res.send("Link already used");

        }




        res.send(`

        <h2>Reset Password</h2>


        <form method="POST" action="/password/updatepassword/${id}">


        <input 
        type="password"
        name="password"
        placeholder="Enter new password"
        required
        />


        <button type="submit">
        Update Password
        </button>


        </form>


        `);



    }
    catch(err){

        console.log(err);

        res.status(500).send("Error");

    }


});










// UPDATE PASSWORD

router.post("/updatepassword/:id", async(req,res)=>{


    try{


        const id = req.params.id;


        const newPassword = req.body.password;



        const request = await ForgotPasswordRequest.findOne({

            where:{
                id:id
            }

        });





        if(!request){

            return res.send("Invalid request");

        }





        if(request.isactive === false){

            return res.send("Link already used");

        }






        const user = await User.findByPk(request.userId);





        if(!user){

            return res.send("User not found");

        }






        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );





        await user.update({

            password:hashedPassword

        });





        await request.update({

            isactive:false

        });





        res.send(`

        <h2>Password Updated Successfully</h2>

        <a href="/login">
        Login Now
        </a>

        `);



    }
    catch(err){

        console.log(err);

        res.status(500).send("Error");

    }



});




module.exports = router;