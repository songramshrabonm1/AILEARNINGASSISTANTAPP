const express = require('express') ; 
const protect = require('../middleware/auth');
const router = express.Router() ; 

const upload = require('../middleware/multer'); 
const { uploadDocument, getDocuments, getDocument, deleteDocument } = require('../controllers/documentController');

// All Route Are Protected
router.use(protect); 


router.post('/upload' ,upload.single('file'), uploadDocument); 
router.get('/', getDocuments); 
router.get('/:id' , getDocument); 
router.delete('/:id' , deleteDocument); 

module.exports = router ; 
