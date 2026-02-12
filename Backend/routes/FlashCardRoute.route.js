const express = require('express') ; 
const router = express.Router() ; 
const protect = require('../middleware/auth'); 
const { getAllFlashcardSets, getFlashcards, reviewFlascard, toggleStarFlascard, deleteFlashcardSet } = require('../controllers/flashCardController');

router.use(protect);

router.get('/' , getAllFlashcardSets);
router.get('/:documentId' , getFlashcards); 
router.post('/:cardId/review' , reviewFlascard); 
router.put('/:cardId/star', toggleStarFlascard);
router.delete('/:id', deleteFlashcardSet); 

module.exports = {router};