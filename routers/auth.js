const router = require('express').Router()
const jwt = require('jsonwebtoken')
const user = require('../models/users')
const { auth2 } = require("../auth")
const { baseURL } = require("../auth")
const bcrypt = require('bcrypt')
require('cookie-parser');
require('dotenv').config()

router.route('/signIn')
    .post(auth2, async (req, res) => {
        var email = req.body.email;
        var password = req.body.password

        console.log(req.body)

        const userFound = await user.findOne({ email })


        if (userFound == null) {
            return res.json({
                status: "error",
                message: "User does not exist sign up to continue"
            });
        } else {
            const passMatch = await bcrypt.compare(password, userFound.password)

            if (passMatch) {
                var accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);

                res.cookie('jwt', accessToken, {
                    httpOnly: true
                })
                const result = await user.findOneAndUpdate({ email }, {
                    $set: {
                        accessToken
                    }
                })
                console.log(result)
                if (result !== null) {
                    res.json({
                        status: "success",
                        message: "Logged in succesfully"
                    });
                } else {
                    res.json({
                        status: "error",
                        message: "Invalid credentials"
                    });
                }
            } else {
                res.json({
                    "status": "error",
                    "message": "Invalid credentials"
                })
            }
        }

    })
router.route('/signUp')
    .post(auth2, async (req, res) => {
        const userExist = await user.findOne({ email: req.body.email })
        if (userExist) {
            return res.json({ status: "error", "message": "Sorry user already exists" })
        }
        const newUser = new user({
            username: req.body.firstName,
            lastName:req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone:req.body.phone
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