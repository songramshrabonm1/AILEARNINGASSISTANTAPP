const { promises } = require('dns');
const fs = require('fs/promises') ; 
const {PDFParse} = require('pdf-parse') ; 

/**
 * Extract text from pdf
 * @param {string} filePath - path to pdf file 
 * @returns {Promise<{text : string , numPages : number}>}
 */

const extractTextFromPDF = async(filePath)=>{
    try{
        const dataBuffer = await fs.readFile(filePath) ; 
        
        //pdf-parse expects a unit8array , not a buffer
        const parse = new PDFParse(new Uint8Array(dataBuffer)) ; 
        const data = await parse.getText() ; 

        return {
            text : data.text , 
            numPages : data.numPages, 
            info : data.info,
        }; 
    }catch(error){
        console.error('Pdf Parsing Error : ', error); 
        throw new Error('Failed To Extract text from pdf') ; 
    }
}

module.exports = {extractTextFromPDF};