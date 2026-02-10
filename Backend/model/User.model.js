const mongoose = require('mongoose') ; 
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide A UserName"],
      unique: true,
      trim: true,
      minlength: [3, "UserName Must Be Atleast 3 character"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Provide an Email"],
      lowercase: true,
      match: [/^\S+@\S+\.\S$/, "Please Provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please Provide An Password"],
      minlength: [6, "Atleast 6 character"],
      select: false,
      /*

যদি select: false না দাও:

const user = await User.findOne({ email });
console.log(user);


Output এ password hash চলে আসবে 

যদিও hashed, তবুও API response এ password থাকা unsafe।

কিন্তু login সময় তো password দরকার!

ঠিক 
তাই login এ manually password select করতে হয়:

const user = await User.findOne({ email }).select('+password');


+password দিয়ে তুমি hidden field include করলে।
        */
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
); ; 

UserSchema.pre('save' , async (next)=>{
    if(!this.isModified('password')){
        next() ; 
    }
    const salt = await bcrypt.gensalt(10) ; 
    this.password = await bcrypt.hash(this.password, salt); 
});
UserSchema.method.matchPassword = async(enterPassword)=>{
    return await  bcrypt.compare(enterPassword , this.password);
}
const User = mongoose.model('User' , UserSchema) ; 
module.exports = User