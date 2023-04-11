const router = require('express').Router()
const jwt = require('jsonwebtoken')

router.route('/')
.post(async(req,res)=>{
    var email = req.body.email;
            var password = req.body.password;
    
            const userFound = await user.findOne({ email })
            
    
            if (userFound == null) {
                return res.json({
                    status: "error",
                    message: "User does ont exist"
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
                        res.redirect(`${baseURL}`)
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


module.exports = router