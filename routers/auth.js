const router = require('express').Router()
const jwt = require('jsonwebtoken')
const user = require('../models/users')
const { auth2 } = require("../auth")
const { baseURL } = require("../auth")
const bcrypt = require('bcrypt')
require('cookie-parser');
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library');
// google Oauth

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = `${baseURL}/auth/signIn/google/callback`;
const REDIRECT_URI2 = `${baseURL}/auth/signUp/google/callback`;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const client2 = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI2);
// --google Oauth

router.route('/signIn/google')
    .get((req, res) => {
        const authUrl = client.generateAuthUrl({
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'],
            state: req.session.csrfToken,
        });
        res.redirect(authUrl);
    });

router.route('/signUp/google')
    .get((req, res) => {
        const authUrl = client2.generateAuthUrl({
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'],
            state: req.session.csrfToken,
        });
        res.redirect(authUrl);
    });

router.route('/signIn/google/callback')
    .get(async (req, res, next) => {
        const { code } = req.query;

        try {
            // Exchange authorization code for access token
            const { tokens } = await client.getToken(code);

            // Set access token for future requests
            client.setCredentials(tokens);

            // Retrieve user information
            const { data: { email, given_name, picture } } = await client.request({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            });

        

            const userFound = await user.findOne({ email })

            if (userFound == null) {
                return res.redirect(`${baseURL}`)
            } else {
                var accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);

                res.cookie('jwt', accessToken, {
                    httpOnly: true
                })
                const result = await user.findOneAndUpdate({ email }, {
                    $set: {
                        accessToken
                    }
                })

                if (result !== null) {

                    return res.redirect(`${baseURL}`)
                } else {
                    return res.redirect(`${baseURL}`)
                }
            }

            // res.redirect('/');
        } catch (err) {
            console.error("error occured ");
            res.redirect(`${baseURL}`);
        }
    });



router.route('/signUp/google/callback')
    .get(async (req, res, next) => {
        const { code } = req.query;

        try {
            // Exchange authorization code for access token
            const { tokens } = await client2.getToken(code);

            // Set access token for future requests
            client2.setCredentials(tokens);

            // Retrieve user information
            const { data: { email, given_name, family_name, picture } } = await client2.request({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            });

            console.log(email, given_name, picture);

            const userFound = await user.findOne({ email })

            if (userFound !== null) {
                return res.redirect(`${baseURL}`)
            }
            const newUser = new user({
                username: given_name,
                email: email,
                password: "",
                profilePic: picture

            })
            //generating token
            const token = await newUser.generateAuthToken();

            res.cookie("jwt", token, {
                httpOnly: true
            });
            const result = await newUser.save()

            if (result) {
                res.redirect(`${baseURL}`)
            }
            else {
                res.json({ message: err.message, type: 'danger' })
            }

            // res.redirect('/');
        } catch (err) {
            console.error("error occured");
            res.redirect(`${baseURL}`);
        }
    });

router.route('/signIn')
    .post(auth2, async (req, res) => {
        var email = req.body.email;
        var password = req.body.password

      

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
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone
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
            res.json({ status: "success", message: "Some error occured please try later", type: 'danger' })
        }

    })


module.exports = router