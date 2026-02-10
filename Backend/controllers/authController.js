const jwt = require('jsonwebtoken') ; 
require('dotenv').config() ; 
const genwebToken = (id)=>{
    return jwt.sign(id , process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRE || '7d'});
}


//@desc Register New User 
//@route POST/api/auth/register
//@access public 
const register = async(req,res,next)=>{
    try{

    }catch(error){
        next(error) ; 
    }
}
//@desc Login User
//@route Post/api/auth/login 
//@access public 

const login = async(req,res,next)=>{
    
}

//@desc Get User Profile 
//@route Get/api/auth/profile 
//@access private 
const getProfile = async(req,res,next)=>{

}

//@desc Update User Profile
//@route PUT/api/auth/profile 
//@access Private
const updateUserProfile = async(req,res,next)=>{

}

//@desc Change Password 
//@route POST/api/auth/changePassword 
// @access Private 
const changePassword = async(req,res, next)=>{

}

module.exports = {
  changePassword,
  updateUserProfile,
  getProfile,
  login,
  register,
};

