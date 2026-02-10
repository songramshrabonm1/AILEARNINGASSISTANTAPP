const jwt = require('jsonwebtoken') ; 

const protect = async(req, res , next)=>{
    let token ; 
    
    // check if token exist in Authorization Header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1] ; 

            //verify token 
            const decode = jwt.verify(token , process.env.JWT_SECRET); 
            req.user = await User.findById(decode.id).select('-password'); 

            if(!req.user){
                return res.status(401).json({
                    success : false , 
                    error : 'User Not Found' , 
                    statusCode : 401 
                });
            }
            next()
        }catch(error){
            console.error('Auth Middleware error: ',error.message); 
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({
                    success : false , 
                    error : 'Token Has Expired', 
                    statusCode : 401
                })
            }

            return res.status(401).json({
                success : false, 
                error : 'Not Authorized , Token Failed', 
                statusCode : 401
            })
        }
    }  
    
    if(!token){
        return res.status(401).json({
            success : false , 
            statusCode : 401 , 
            error : 'Not Authorized , not Toekn' 
        })
    }
}
module.exports = protect; 