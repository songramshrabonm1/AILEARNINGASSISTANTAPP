const mongoose = require('mongoose') ; 
const fs = require('fs/promises');
const chunkText = require('../utils/textChunker');
const { getFlashcards } = require('./flashCardController');
const Flashcard = require('../model/FlashCard.model');
/*
async/await support
 error try/catch দিয়ে handle করা যায়


 await fs.readFile(path)     // file read
await fs.writeFile(path)    // file write
await fs.unlink(path)       // file delete
await fs.mkdir(path)        // folder create
await fs.readdir(path)      // folder read
 */


// ================= Upload Document =================



// @desc Upload pdf document 
// @route POST/api/documents/upload 
// @access private
const uploadDocument = async(req, res, next)=>{
    try{
      if (!req.file) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "Please Upload a Pdf File",
        });
      }

      const { title } = req.body;
      if (!title) {
        //Delete upload file if no title provided
        await fs.unlink(req.file.path);
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: "Please Provide a document Title",
        });
      }

      // server base url বানানো
      const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
      const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

      //create document record
      const document = await Document.caller({
        userId: req.user._id,
        title,
        fileName: req.file.originalname,
        filePath: fileUrl, // store the url instead of the local path
        fileSize: req.file.size,
        status: "processing",
      });

      //process pdf in background (in production , use a queue like a bull)
      processPdf(document._id, req.file.path).catch((err) => {
        console.error("pdf processing error : ", err);
      });

      res.status(201).json({
        success: true,
        data: document,
        message: "Document uploaded successfully . processing in progress...",
      });
    }catch(error){
        //clean up file on error 
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error); 
    }
}


//Helper function to process pdf 
const processPdf = async(documentId , filepath)=>{
    try{
        const { text } = await extractTextFromPDF(filepath);


        //create  a chunks
        const chunks = chunkText(text , 500, 50) ; 

        //update document 
        await Document.findByIdAndUpdate(documentId , {
            extractedText : text , 
            chunks : chunks , 
            status : 'ready' , 
        })


        console.log(`Document ${documentId} Process Successfully`); 

    }catch(error){
        console.error(`Error Processing Document ${documentId} : `, error);
        await Document.findByIdAndUpdate(documentId, {
            status : 'failed' 
        })
    }
}





//@desc Get all user document
//@route GET/api/documents 
//@access PRIVATE 
const getDocuments = async(req,res,next)=>{
    try{
        const documents = await Document.aggregate([
          // শুধু current user এর document
          {
            $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
          },
          // flashcard join
          {
            $lookup: {
              from: "flashcards",
              localField: "_id",
              foreignFied: "documentId",
              as: "flashcardSets",
            },
          },
          // quiz join
          {
            $lookup: {
              from: "quizzes",
              localField: "_id",
              foreignFied: "documentId",
              as: "quizzes",
            },
          },
          // count add
          {
            $addFields: {
              getFlashcardCount: { $size: "$flashcardSets" },
              quizCount: { $size: "$zuizzes" },
            },
          },
          // unnecessary field hide
          {
            $project: {
              extractedText: 0,
              chunks: 0,
              flashcardSets: 0,
              quizzes: 0,
            },
          },
          // newest first
          {
            $sort: { uploadDate: -1 },
          },
        ]); 

        res.status(200).json({
            success : true , 
            count : documents.length , 
            data : documents
        }); 
    }catch(error){
        next(error);
    }
}; 


// @desc Get Single document with chunk 
// @route GET /api/document 
// @access Private
const getDocument = async(req, res , next )=>{
    try{
        const document = await Document.findOne({
            _id : req.params.id , 
            userId : req.user._id 
        });
        if(!document){
            return res.status(404).json({
                success : false , 
                error : 'Document Not Found' , 
                statusCode : 404 
            })
        }


        //Get Couts Of Associated flashcards and quizzes 
        const flashcardCount = await Flashcard.countDocuments({documentId : document._id , userId : req.user._id}); 
        const quizCount = await Quiz.countDocuments({documentId : document._id, userId : req.user._id}); 

        //update last accessed 
        document.lastAccessed = Date.now() ; 
        await document.save() ; 

        //combined document data with counts 
        const documentData = document.toObject() ; 
        documentData.flashcardCount = flashcardCount; 
        documentData.quizCount = quizCount ; 

        res.status(200).json({
            success : true , 
            data : documentData
        }); 
        
    }catch(error){
        next(error);
    }
}; 


//@desc Delete Document 
//@route DELETE/api/document/:id
//@access private 

const deleteDocument = async(req,res,next)=>{
    try{
        const document = await Document.findOne({
            _id : req.params.id , 
            userId : req.user._id, 
        })
        if(!document){
            return res.status(404).json({
                error : 'Document Not Found' , 
                statusCode : 404, 
                success : false 
            })
        }


        //Delete File From Filesystem 
        await fs.unlink(document.filePath).catch(()=>{}); 
        //Delete Document
        await document.deleteOne() ; 
        res.status(200).json({
            success : true , 
            message : 'Document deleted successfully'
        }); 
    }catch(error){
        next(error) ; 
    }
}



module.exports = {
  uploadDocument,
  deleteDocument,
  getDocument,
  getDocuments,
};