const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const jasonwebtoken = require('jsonwebtoken');
// const {use} = require('react');
//@desc Register a user
//@route GET /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //Hash password
    const hanshedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password is ${hanshedPassword}` );
    
    const user = await User.create({
        name: username,
        email,
        password: hanshedPassword,   
    });
    console.log(`User created ${user}`);
    if (user) {
        res.status(201).json({_id: user._id,email : user.email});
    }
    else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.status(201).json({ message: "User registered successfully" });
    res.json({ message: "Register user" });
});

//@desc Login user
//@route POST /api/users/register
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const user = await User.findOne({ email });

    // comapare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
},
        },
            process.env.JWT_SECRET,
        {expiresIn: "1m"}
        );
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    res.json({ message: "Login user" });
});

//@desc Login user
//@route POST /api/users/register
//@access Public
const currentUser = asyncHandler(async (req, res)  => {
    res.json({ message: "Current user" });
});





module.exports = { registerUser,loginUser,currentUser };