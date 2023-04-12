const router = require('express').Router()
const jwt = require('jsonwebtoken')
const user = require('../models/users')
const { auth2 } = require("../auth")
const { baseURL } = require("../auth")
require('cookie-parser');

router.route('/signIn')
    .post(async (req, res) => {
        var email = req.body.email;
        var password = req.body.password

        console.log(req.body)

        // const userFound = await user.findOne({ email })


        // if (userFound == null) {
        //     return res.json({
        //         status: "error",
        //         message: "User does ont exist"
        //     });
        // } else {
        //     const passMatch = await bcrypt.compare(password, userFound.password)

        //     if (passMatch) {
        //         var accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);

        //         res.cookie('jwt', accessToken, {
        //             httpOnly: true
        //         })
        //         const result = await user.findOneAndUpdate({ email }, {
        //             $set: {
        //                 accessToken
        //             }
        //         })
        //         console.log(result)
        //         if (result !== null) {
        //             res.redirect(`${baseURL}`)
        //         } else {
        //             res.json({
        //                 status: "error",
        //                 message: "Invalid credentials"
        //             });
        //         }
        //     } else {
        //         res.json({
        //             "status": "error",
        //             "message": "Invalid credentials"
        //         })
        //     }
        // }

    })
router.route('/signUp')
    .post(async (req, res) => {
        console.log(req.body)
        const userExist = await user.findOne({ email: req.body.email })
        if (userExist) {
            return res.json({ status: "error", "message": "Sorry user already exists" })
        }
        const newUser = new user({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,

        })
        //generating token
        const token = await newUser.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true
        });
        const result = await newUser.save()

        if (result) {
            res.json({ status: "success", message: "Signed up succesfully", type: 'success' })
        }
        else {
            res.json({ status: "success", message: "some error occured please try later", type: 'danger' })
        }

    })


module.exports = router