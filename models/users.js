const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    username: String,
    createdAt: {
        type: String,
        default: Date.now
    },
    email: String,
    profilePic: String,
    profilePicPublicId: String,
    password: String,
    aboutMe:String,
    onTheWeb:{
        github:String,
        linkedin:String,
        instagram:String,
        facebook:String,
        website:String,
        twitter:String
    },
    personalInfo:{
        Education:String,
        currentJob:String
    },
    interests:[],
    accessToken: {
        type: String
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, "himanmynameisanabilbaruahandimlearningmernstack")
        this.accessToken = token
        await this.save();
        return token;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model("user", userSchema)