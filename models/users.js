const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv')

const userSchema = mongoose.Schema({
    username: {type:String, default:"", required:true},
    lastName: {type:String, default:"", required:true},
    createdAt: {
        type: String,
        default: Date.now
    },
    email: {type:String, default:"", required:true},
    profilePic:
        {type: String, 
        default : "https://res.cloudinary.com/dudvqptv0/image/upload/v1681324609/anonymous-avatar-icon-25_elypk2.png"},
    profilePicPublicId: String,
    password: String,
    aboutMe: {type:String, default:""},
    phone: {type:String, default:"", required:true},
    onTheWeb: {
        github: {type:String, default:""},
        linkedin: {type:String, default:""},
        instagram: {type:String, default:""},
        facebook: {type:String, default:""},
        website: {type:String, default:""},
        twitter: {type:String, default:""}
    },
    personalInfo: {
        Education: {type:String, default:"Graduation"},
        currentJob: {type:String, default:"College student"}
    },
    interests: [],
    accessToken: {
        type: String
    },
    followers:[{
        _id:mongoose.ObjectId,
        name:String,
        profilePic:String,
        profession:String
    }]
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET)
        this.accessToken = token
        await this.save();
        return token;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model("user", userSchema)