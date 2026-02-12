//@desc Get all flashcards for a document
//@route Get/api/flashcards/:documentId 
//@access Private

const Flashcard = require("../model/FlashCard.model");

const getFlashcards = async(req,res,next)=>{
    try{
        const flashcards = await Flashcard.find({
            userId : req.user._id ,
            documentId : req.params.documentId 
        })
            .populate('documentId' , 'title fileName')
            .sort({createdAt : -1})

        res.status(200).json({
            success : true , 
            count : flashcards.length , 
            data : flashcards
        }); 
    }catch(error){
        next(error) ; 
    }
}


//@desc get all flashcard sets for a user 
//@route GET / api/flashcards
//@access private 
const getAllFlashcardSets = async(req,res, next) =>{
    try{
        const flashcardsets = await Flashcard.find({userId : req.user._id})
            .populate('documentId' , 'title')
            .sort({createdAt : -1})

        res.status(200).json({
            success : true , 
            count : flashcardsets.length , 
            data : flashcardsets
        }); 
    }catch(error){
        next(error);
    }
}

//@desc Mark flashcard as reviewed 
//@route POST/api/flashcards/:cardId/review 
//@access Private 
const reviewFlascard = async(req,res,next)=>{
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id' : req.params.cardId , 
            userId : req.user._id 
        });
        if(!flashcardSet){
            return res.status(404).json({
                success : false , 
                error : 'Flashcard set or card not found' , 
                statusCode : 404
            })
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if(cardIndex === -1){
            return res.status(404).json({
                success : false , 
                error : 'card not found in set',
                statusCode : 404
            })
        }


        //update review info 
        flashcardSet.cards[cardIndex].lastReviewed = new Date() ; 
        flashcardSet.cards[cardIndex].reviewCount += 1 ; 

        await flashcardSet.save() ; 

        res.status(200).json({
            success : true , 
            data : flashcardSet , 
            message : 'Flascard reviewed successfully'
        });
    } catch (error) {
      next(error);
    }
}

//@desc Toggle star/favorite on flashcard
//@route PUT/api/flascards/:cardId/star
//@access Private
const toggleStarFlascard = async(req,res,next)=>{
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id' : req.params.cardId , 
            userId : req.user._id 
        }); 
        if(!flashcardSet){
            return res.status(404).json({
                success : false , 
                error : 'Flashcard set or card not found' , 
                statusCode : 404
            })
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId); 
        if(cardIndex === -1){
            return res.status(404).json({
                success : false , 
                error : 'Card Not Found In Set', 
                statusCode : 404 
            })
        }

        //Toggle Star 
        flashcardSet.cards[cardIndex].isStarred= !flashcardSet.cards[cardIndex].isStarred; 
        await flashcardSet.save();

        return res.status(200).json({
            success : true , 
            data : flashcardSet, 
            message : `Flascard ${flashcardSet.cards[cardIndex].isStarred ? 'starred': 'unstarred'}`
        });
    } catch (error) {
      next(error);
    }
}


//@desc Delete flashcard set
//@route DELETE /api/flashcards/:id
//@access Private
const deleteFlashcardSet = async(req,res,next)=>{
    try {
        const flashcardSet = await Flashcard.findOne({
            _id : req.params.id , 
            userId : req.user._id
        })
        if(!flashcardSet){
            return res.status(404).json({
                success : false , 
                error : 'flashCard set Not Found', 
                statusCode : 404
            })
        }
        await flashcardSet.deleteOne() ; 

        res.status(200).json({
            message : 'Flashcard set deleted successfully' , 
            success : true , 
            statusCode : 200

        })
    } catch (error) {
      next(error);
    }
}


module.exports = {
  deleteFlashcardSet,
  getFlashcards,
  toggleStarFlascard,
  getAllFlashcardSets,
  reviewFlascard,
};