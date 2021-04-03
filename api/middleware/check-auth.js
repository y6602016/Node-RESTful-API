const jwt = require('jsonwebtoken');


module.exports = (req, res, next)=> {
    try{
        // put the token in the header instead of body
        // then we don't need to consider about the body parser
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    
}