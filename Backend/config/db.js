const mongoose = require('mongoose') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 
const ConnectDb = async()=>{
    try{

        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('Mongodb Connected');
    }catch(error){
        console.log('Error: ', error);
        process.exit(1) ; 
    }
}
module.exports = ConnectDb; 