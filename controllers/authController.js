const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    // extract from body
    const {username, password} = req.body

    try {
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 12)
        
        const newUser = await User.create({
            username: username,
            password: hashPassword
        })
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
    
}