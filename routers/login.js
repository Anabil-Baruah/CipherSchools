const router = require('express').Router()
const user = require('../models/users')
const bcrypt = require('bcrypt')

router.route('/')
    .get(async (req, res) => {
        res.render('login')
    })

router.route('/aboutMe')
    .post(async (req, res) => {
        const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                aboutMe: req.body.aboutMe
            }
        })

        if (userUpdate) {
            res.json({
                status: "success",
                message: "User updated succcesfully"
            })
        } else {
            res.json({
                status: "error",
                message: "Some error occured please try later"
            })
        }
    })

router.route('/onTheWeb')
    .post(async (req, res) => {
        let requsetBody = req.body
        for (let key in requsetBody) {
            requsetBody[key] === "" ? delete requsetBody[key] : null
        }

        const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                onTheWeb: {
                    github: requsetBody.github,
                    linkedin: requsetBody.linkedin,
                    instagram: requsetBody.instagram,
                    facebook: requsetBody.facebook,
                    website: requsetBody.website,
                    twitter: requsetBody.twitter
                }
            }
        })

        if (userUpdate) {
            res.json({
                status: "success",
                message: "User updated succcesfully"
            })
        } else {
            res.json({
                status: "error",
                message: "Some error occured please try later"
            })
        }
        console.log(requsetBody)
    })
router.route('/personalInfo')
    .post(async (req, res) => {
        const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                personalInfo: {
                    Education: req.body.Education,
                    currentJob: req.body.WYD
                }
            }
        })

        if (userUpdate) {
            res.json({
                status: "success",
                message: "User updated succcesfully"
            })
        } else {
            res.json({
                status: "error",
                message: "Some error occured please try later"
            })
        }
    })
router.route('/passwordUpdate')
    .post(async (req, res) => {
        const newPassword = req.body.newPassword
        const prevPassword = req.body.prevPasssword
        const retypePassword = req.body.retypePassword
        const accessToken = req.accessToken

        if(prevPassword !== retypePassword){
            return res.json({
                status:"error",
                message:"Passwords dosent matches"
            })
        }

        const userFound = await user.findOne({ accessToken })

        if (userFound == null) {
            return res.json({
                status: "error",
                message: "User does ont exist"
            });
        } else {
            const passMatch = await bcrypt.compare(prevPassword, userFound.password)

            if (passMatch) {
                const result = await user.findOneAndUpdate({ accessToken }, {
                    $set: {
                        password: newPassword
                    }
                })
                console.log(result)
                if (result !== null) {
                    res.json({
                        status: "success",
                        message: "password changed succesfully"
                    })
                } else {
                    res.json({
                        status: "error",
                        message: "Sorry some error occured try later"
                    });
                }
            } else {
                res.json({
                    "status": "error",
                    "message": "Invalid password"
                })
            }
        }
    })
router.route('/editInterests')
    .post(async(req,res)=>{
        
    })

module.exports = router