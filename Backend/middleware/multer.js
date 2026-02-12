const multer = require('multer') ; 
const path = require('path') ; 
const {fileURLToPath}  = require('url') ; 
const fs = require('fs') ; 

const __filename = fileURLToPath(import.meta.url) ; 
const __dirname = path.dirname(__filename) ; 



// ..upload/documents
const uploadDir = path.join(__dirname , '') ; 
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir , {recursive : true});
}



// configure storage
const storage = multer.diskStorage({
    destination : (req,file , cb)=>{
        cb(null, uploadDir) ;
    },
    filename : (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random() *1E9) ; 
        cb(null , `${uniqueSuffix}-${file.originalname}`);
    }
})

//file filter -only pdf
const fileFilter = (req,file , cb)=>{
    if(file.minetype === "application/pdf"){
        cb(null, true);
    }else{
        cb(new Error('Only PDF files are allowed!') , false);
    }
};


//configure multer 
const upload = multer({
    storage : storage , 
    fileFilter : fileFilter , 
    limits : {
        fileSize : parseInt(process.env.MAX_FILE_SIZE) || 10485760 //10mb default
    }
}); 

module.exports = upload 