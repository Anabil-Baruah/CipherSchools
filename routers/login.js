const router = require('express').Router()
const user = require('../models/users')
const bcrypt = require('bcrypt')
const { auth, baseURL } = require('../auth')
const cloudinary = require('../public/JS/fileUploadAPI')

router.route('/')
    .get(async (req, res) => {
        const jwtCookie = req.cookies.jwt;
        var userInfo = {}
        if (jwtCookie !== undefined) {
            userInfo = await user.aggregate([
                {
                    $match: {
                        accessToken: jwtCookie
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        profilePic: 1,
                        interests: 1,
                        onTheWeb: 1,
                        email: 1,
                        aboutMe: 1,
                        phone: 1,
                        lastName: 1,
                        personalInfo: 1,
                        interests: 1,
                        followers: 1
                    }
                }
            ]);
            userInfo = userInfo[0]
        }
        res.render('login', { cookie: jwtCookie, userInfo, baseURL })
    })

router.route('/aboutMe')
    .post(auth, async (req, res) => {
        const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                aboutMe: req.body.aboutMe
            }
        })

        if (userUpdate) {
            res.json({
                status: "success",
                message: "Field updated succcesfully"
            })
        } else {
            res.json({
                status: "error",
                message: "Some error occured please try later"
            })
        }
    })

router.route('/onTheWeb')
    .post(auth, async (req, res) => {
        let requsetBody = req.body
      
        for (let key in requsetBody) {
            requsetBody[key] === "" ? delete requsetBody[key] : null
        }

        const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                onTheWeb: {
                    github: requsetBody.gitHub,
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
       
    })
router.route('/personalInfo')
    .post(auth, async (req, res) => {

        const userFound = await user.findOne({ accessToken: req.accessToken })
        if (userFound === null) {
            return res.json({
                status: "error",
                message: "User has been logged out"
            })
        }

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
    .post(auth, async (req, res) => {
        const newPassword = req.body.newPassword
        const prevPassword = req.body.prevPasssword
        const retypePassword = req.body.retypePassword
        const accessToken = req.accessToken
       

        if (newPassword.toString() !== retypePassword.toString()) {
            return res.json({
                status: "error",
                message: "Passwords dosent matches"
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
                const hashed = await bcrypt.hash(newPassword, 10);
                const result = await user.findOneAndUpdate({ accessToken }, {
                    $set: {
                        password: hashed
                    }
                })
              
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

router.route('/profileInfoChange')
    .post(auth, async (req, res) => {
        const userFound = await user.findOne({ accessToken: req.accessToken })
      
        const fileType = req.body.fileType
        if (fileType !== undefined) {

            cloudinary.uploader.upload(`data:${req.body.fileType};base64,${req.body.base64String}`, {
                resource_type: 'raw',
                folder: 'images/cipherSchool',
                width: 1000,
                height: 600
                // crop: "scale"
            }).then(async (result) => {
                const userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
                    $set: {
                        profilePic: result.url,
                        username: req.body.firstName,
                        email: req.body.email,
                        lastName: req.body.lastName,
                        phone: req.body.number,
                        profilePicPublicId: result.public_id
                    }
                })

                if (userUpdate)
                    res.json({ status: "success", url: result.url, message: "Profile updated succesfully" })
                else
                    res.json({ status: "error", url: "", message: "Sorry some error occured" })

            }).catch(() => {
                console.log("error occured")
            })
            return
        }
        var userUpdate = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                username: req.body.firstName,
                email: req.body.email,
                lastName: req.body.lastName,
                phone: req.body.number
            }
        })
       
        if (userUpdate)
            res.json({ status: "success", message: "Profile updated succesfully" })
        else
            res.json({ status: "error", message: "Sorry some error occured" })
    })

router.route('/followers')
    .get(auth, async (req, res) => {
        const userFound = await user.findOne({ accessToken: req.accessToken })
        if (userFound === null) {
            return res.json({
                status: "error",
                message: "User has been logged out"
            })
        }
        const suggestions = await user.aggregate([{ $project: { _id: 1, profilePic: 1, username: 1, email: 1, followers: 1 } }])
      
        res.json({
            status: "success",
            followers: userFound.followers,
            suggestions
        })
    })

router.route('/updateInterests')
    .post(auth, async (req, res) => {
        var intrestArr = req.body

        const userFound = await user.findOne({ accessToken: req.accessToken })
        if (userFound === null) {
            return res.json({
                status: "error",
                message: "User has been logged out"
            })
        }

        const updateInterests = await user.updateOne({ accessToken: req.accessToken }, {
            $set: {
                interests: intrestArr
            }
        })
        if (updateInterests) {
            res.json({
                status: "success",
                message: "Field updated succcesfully"
            })
        } else {
            res.json({
                status: "error",
                message: "Some error occured please try later"
            })
        }
    })

router.route('/logout')
    .get(auth, async (req, res) => {
        res.clearCookie('jwt');
        res.json({
            status: "success"
        })
    })

module.exports = router