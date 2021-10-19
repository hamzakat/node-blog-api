const protect = (req, res, next) => {
    const {user} = req.session  

    // if the user is not logged in
    if(!user) {
        return res.status(401).json({status: "fail", message: "unauthorized"})
    } 
    
    // if the user is logged in 
    req.user = user  
    next()
}

module.exports = protect