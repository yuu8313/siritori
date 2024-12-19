function getAIResponse(lastWord) {
    if (!lastWord) return null;
    
    const lastChar = lastWord[lastWord.length - 1];
    const possibleResponses = words.filter(word => 
        word[0] === lastChar && 
        !word.endsWith('ん') && 
        word.length >= 2
    );
    
    if (possibleResponses.length === 0) return null;
    
    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}