(function() {
  let button = document.getElementById('clean-button');
  button.addEventListener("click", modifyText);
})();

function modifyText() {
  const textToClean = document.getElementById('clean-text').value.replace(/[^a-zA-Z]+/g, ' ');
  const textoToCleanArray = textToClean.split(' ').filter(w => w);

  for (let index = 0; index < textoToCleanArray.length; index++) {
    // Get the word and its first letter
    const word = textoToCleanArray[index];
    const wordFirstLetter = word[0].toLowerCase();

     // Get the correct dictionary
    const redundantPhrasesArray = redundantDictionary[wordFirstLetter];
    
    // Iterate over the correct dictionary, and compare with the full word of the text
    for (let index = 0; index < redundantPhrasesArray.length; index++) {
      const redundantPhrase = redundantPhrasesArray[index];

      if(redundantPhrase.includes(word.toLowerCase())) {
        const redundantPhraseLength = redundantPhrase.split(' ').length;
        const redundantPhraseComplete = redundantPhrase.replace(/[()]/g,"").toLowerCase();
        const redundantWord = redundantPhrase.match(/\((.*)\)/).pop();

        const phraseToCompare = createPhraseToCompare(redundantPhraseLength, word, textoToCleanArray);

        if(phraseToCompare.toLowerCase() === redundantPhraseComplete) {
          console.info('Word:', redundantWord);
          console.info('Detected:', phraseToCompare);
        }
      }
    }
  }
}

// Factorial function, construct the phrase to compare depending the redundantPhraseLength
function createPhraseToCompare(redundantPhraseLength, word, textoToCleanArray) {
  const index = textoToCleanArray.indexOf(word);

  if(redundantPhraseLength === 1) {
    return word;
  }

  return word + ' ' + createPhraseToCompare(redundantPhraseLength - 1, textoToCleanArray[index+1], textoToCleanArray)
}