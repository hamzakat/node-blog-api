const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { use } = require('../routes/userRoute');

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
        req.session.user = newUser   
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

exports.login = async (req, res) => {
    // extract from body
    const {username, password} = req.body

    try {
        
        // search for the user in the DB
        const user = await User.findOne({username})
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }
        
        // compare the recived password with the encrypted password in the DB
        const isCorrect = await bcrypt.compare(password, user.password)
        
        console.log(1212)
        if (isCorrect) {
            req.session.user = user // assign user object to "user" property of session   
            res.status(200).json({
                status: "success"
            })
        } else {
            res.status(400).json({
                status: "fail",
                message: "password not correct"
            })
        }
        
       
    } catch (e) {
        res.status(400).json({
            status: "fail",
        })
    }
}