const jwt = require('jsonwebtoken');

const adminLogin = async(req,res) =>{
    const {email, password} = req.body;

    if(email !== process.env.ADMIN_EMAIL) {
        return res.status(404).json({message: "Admin not found with this email"});
    }

    if(password !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({message: "Incorrect Password"});
    }

    const payload = {email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1m'});

    res.json({token, message: "Login successful"});
}


module.exports = {adminLogin}