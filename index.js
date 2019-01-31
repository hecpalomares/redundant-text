(function() {
  let button = document.getElementById('clean-button');
  button.addEventListener("click", modifyText);
})();

function modifyText() {
  const textToClean = document.getElementById('clean-text').value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");    // Get text-area
  const textoToCleanArray = textToClean.split(' ').filter(w => w);                                                // Trim white space

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
        // get the length of the redundantPhrase
        const redundantPhraseLength = redundantPhrase.split(' ').length;
        const phraseToCompare = createPhraseToCompare(redundantPhraseLength, word, textoToCleanArray);

        if(phraseToCompare.toLowerCase() === redundantPhrase.replace(/[()]/g,"").toLowerCase()) {
          console.log('Detected:', phraseToCompare);
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