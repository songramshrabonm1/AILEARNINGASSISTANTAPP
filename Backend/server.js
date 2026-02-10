const dotenv = require('dotenv') ; 
dotenv.config() ; 

const express = require('express') ; 
const cookieparser = require("cookie-parser"); ; 
const cors = require('cors') ; 
const path = require('path') ; 
const {fileURLToPath} = require('url') ;
const ConnectDb = require('./config/db'); 
const { errorHandler } = require('./middleware/errorHandler');

//Es6 module directory name alternativ 
const __filename = fileURLToPath(import.meta.url) ; 
const __dirname = path.dirname(__filename) ; 


//express js server initiaze
const app = express() ; 



// middleware 
app.use(cors({
    origin : '*' , 
    methods : ['GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE' ], 
    allowedHeaders : ['Content-Type' , 'Authorization'],
    credentials : true
}))
app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(cookieparser());
app.use(errorHandler) ; 

//static folder for upload 
app.use('/uploads' ,express.static(path.join(__dirname, 'uploads'))) ; 


//routes


//404 handler
app.use((req,res)=>{
    res.status(404).json({
        success : false , 
        error : "Router Not Found" , 
        statusCode : 404  
    })
})

// start the server 
const port = process.env.PORT ; 
app.listen(port , async()=>{
    // Connect To Database
    await ConnectDb() ; 
    console.log(`Server Running at the port -${port}`);
})
process.on('unhandledRejection' , (err)=>{
    console.log(`Error ${err.message}`); 
    process.exit(1) ; 
})


