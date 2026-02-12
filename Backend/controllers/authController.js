const jwt = require('jsonwebtoken') ; 
const User = require('../model/User.model');
require('dotenv').config() ; 
const generateToken = (id)=>{
    return jwt.sign(id , process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRE || '7d'});
}


//@desc Register New User 
//@route POST/api/auth/register
//@access public 
const register = async(req,res,next)=>{
    try{

        const {email , username , password } = req.body ; 

        //check if user exist 
        const userExists = await User.findOne({$or : [{email },{ username}]}); 

        if(userExists){
            res.status(400).json({
                error : userExists.email === email ? 'Email Already Exist' : 'UserName Already Exist', 
                statusCode : 400 , 
                success : false 
            })
        }

        const user = await User.create({
          username,
          email,
          password,
        });

        const token = generateToken(user._id) ; 
        res.status(200).json({
            success : true , 
            token , 
            message : "User Registered Successfully" , 
            data : {
                user : {
                    id : user._id , 
                    user : user.username , 
                    email : user.email , 
                    profileImage : user.profileImage , 
                    createdAt : user.createdAt
                }
            }
        })

    }catch(error){
        next(error) ; 
    }
}
//@desc Login User
//@route Post/api/auth/login 
//@access public 
const login = async(req,res,next)=>{
   try{
 const { email, password } = req.body;
 if (!email || !password) {
   return res.status(400).json({
     success: false,
     error: "Please Provide email and password",
     statusCode: 400,
   });
 }

 // check user
 const user = await User.findOne({ email }).select("+password");

 if (!user) {
   return res.status(401).json({
     success: false,
     error: "Invalid Credentials",
     statusCode: 401,
   });
 }

 // check password

 const isMatch = await user.matchPassword(password);
 if (!isMatch) {
   return res.status(401).json({
     statusCode: 401,
     success: false,
     error: "Invalid Credentials",
   });
 }

//  generate token 
const token = generateToken(user._id) ; 
return res.status(200).json({
    statusCode : 200 , 
    success : true , 
    message : 'Login Successfully' , 
    token , 
    user:{
        id : user._id , 
        username : user.username, 
        email : user.email , 
        profileImage : user.profileImage 
    }
})
   }catch(error){
    next(error);
   }
}

//@desc Get User Profile 
//@route Get/api/auth/profile 
//@access private 
const getProfile = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user._id); 
        res.status(200).json({
            success : true , 
            data : {
                id : user._id , 
                username : user.username, 
                email : user.email , 
                profileImage : user.profileImage , 
                createdAt : user.createdAt, 
                updatedAt : user.updatedAt
            }
        })
    }catch(error){
        next(error) ; 
    }
}

//@desc Update User Profile
//@route PUT/api/auth/profile 
//@access Private
const updateUserProfile = async(req,res,next)=>{
    try{
        const {username , email , profileImage} = req.body ; 
        const user = await User.findById(req.user._id) ; 

        if(username){
            user.username = username 
        }
        if(email){
            user.email = email 
        }
        if(profileImage){
            user.profileImage = profileImage
        }
        await user.save(); 

        res.status(200).json({
            success : true , 
            message : 'Profile Updated successfully', 
            data: {
                id : user._id , 
                username : user.username , 
                email : user.email , 
                profileImage : user.profileImage 
            }
        })
    }catch(error){
        next(error); 
    }
}

//@desc Change Password 
//@route POST/api/auth/changePassword 
// @access Private 
const changePassword = async(req,res, next)=>{
    try{
        const {currentpassword , newpassword} = req.body ; 
        if(!currentpassword || !newpassword){
            return res.status(400).json({
                error : 'Please Provide Current and new password' , 
                statusCode : 400 , 
                success : false 
            })
        }

        const user = await User.findById(req.user._id).select('+password'); 

        //check current password 
        const isMatch = await user.matchPassword(currentpassword) ; 
        if(!isMatch){
            return res.status(401).json({
                statusCode : 401, 
                success : false , 
                error : "Password Not Match Successfully..."
            })
        }

        //updatepassword 
        user.password = newpassword ; 
        await user.save() ; 

        return res.status(201).json({
            statusCode : 201 , 
            success : true , 
            message : 'Change Password Successfully'
        })
    }catch(error){
        next(error); 
    }
}

module.exports = {
  changePassword,
  updateUserProfile,
  getProfile,
  login,
  register,
};

