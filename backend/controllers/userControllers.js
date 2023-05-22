const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken')


const signUpUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExists = await User.findOne({ email });


    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create user");
    }

});


const loginUser = asyncHandler(async (req, res) => {
    const { email,password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const user = await User.findOne({ email });

    if(!user){
        res.status(400).json({success: false,message:"User does not exist"});
        throw new Error("User does not exist");
    }
    const passwordMatch= await user.passMatch(password);

    if (user && passwordMatch) {
        res.status(200).json({
            success:true,
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }

    else{
        res.json({success: false,message:"Enter valid credentials"})
        throw new Error("Enter valid credentials");
    }
})

//  /api/users?search=hardik

const allUsers = asyncHandler(async (req,res)=>{
    const keyword =req.query.search ? {$or:[
        {name : {$regex: req.query.search, $options: "i"}},
        {email : {$regex: req.query.search, $options: "i"}}
    ]}:{}

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}}) // we dont want to get the user currently using the app.

    res.send(users)

})

module.exports = { signUpUser ,loginUser,allUsers}