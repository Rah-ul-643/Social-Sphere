const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY; 

const auth = (req,res,next) => {
    const token = req.cookies.token;

    if (!token){
        res.status(401).json({message:"No token provided."});
    }
    else{
        jwt.verify(token,secretKey,(err, decoded)=>{
            if (err){
                console.log('invalid token');
                res.status(401).json({message: "Unauthorized access!"});
            }
            else{
                req.username = decoded.username;
                next();
            }
        })

    }
}

module.exports = auth;