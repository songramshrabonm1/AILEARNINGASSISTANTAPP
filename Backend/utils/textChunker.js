/**
 * Split text into chunks for better AI processing
 * @param {String} text - Full text to chunk
 * @param {Number} chunkSize - Target words per chunk
 * @param {Number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */

const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) return [];

  // Clean text while preserving paragraph structure
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();

  const paragraphs = cleanedText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks = [];
  let currentChunkWords = [];
  let chunkIndex = 0;

  const pushChunk = (words) => {
    if (!words || words.length === 0) return;
    chunks.push({
      content: words.join(" "),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
  };

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);

    // If paragraph itself is bigger than chunk size → split by words
    if (words.length > chunkSize) {
      // flush current chunk first
      if (currentChunkWords.length > 0) {
        pushChunk(currentChunkWords);
        currentChunkWords = [];
      }

      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const slice = words.slice(i, i + chunkSize);
        pushChunk(slice);

        if (i + chunkSize >= words.length) break;
      }
      continue;
    }

    // If adding paragraph exceeds chunk → push current chunk first
    if (currentChunkWords.length + words.length > chunkSize) {
      pushChunk(currentChunkWords);

      // create overlap from previous chunk
      const overlapWords = currentChunkWords.slice(
        -Math.min(overlap, currentChunkWords.length),
      );

      currentChunkWords = [...overlapWords, ...words];
    } else {
      currentChunkWords.push(...words);
    }
  }






  // push last chunk
  if (currentChunkWords.length > 0) {
    pushChunk(currentChunkWords);
  }

  // fallback (very small text)
  if (chunks.length === 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
      const slice = allWords.slice(i, i + chunkSize);
      pushChunk(slice);
      if (i + chunkSize >= allWords.length) break;
    }
  }

  return chunks;
};



/**
 * @param {Array<Object>} chunks - Array Of Chunk 
 * @param {String} query - search query 
 * @param {number} maxChunks - maximum chunks to return 
 * @returns {Array<Object>} 
 * 
 */


const findRelevantChunks = (chunks , query, maxChunks = 3 )=>{
    if(!chunks || !query || chunks.length === 0)return [] ; 

    //Common Stop Word To exclude 
    const stopWords = new Set([
        'the' , 'is' , 'at' , 'which' , 'on' , 'a' , 'an' , 'and' , 'and' , 'or',
        'but' , 'in' , 'with' , 'to' , 'for' , 'of' , 'as' , 'by' , 'this' , 'that',
        'it'
    ])

    const queryword = query
        .toLowerCase()
        .split('/\s+/')
        .filter(w=> w.length > 2 && !stopWords.has(w)); 

    if(queryword.length == 0 ){
        //Return clean chunk object without mongoose metadata
        return chunks.slice(0, maxChunks).map(chunk => (
            {
                content : chunk.content,
                chunkIndex : chunk.chunkIndex , 
                pageNumber : chunk.pageNumber , 
                _id : chunk._id
            }
        )); 
    }

    const scoredChunks = chunks.map((chunk, index)=>{
        const content = chunk.content.toLowerCase() ; 
        const contentWords = content.split('/\s+/').length; 
        let score = 0 ; 


        // Score each query words 
        
    })
}

module.exports = chunkText;
