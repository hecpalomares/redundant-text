(function initListeners() {
  const button = document.getElementById('analyze-button');
  button.addEventListener("click", analyzeRedundancyText);
})();

function analyzeRedundancyText() {
  const originalText = document.getElementById('original-text').value.replace(/[^a-zA-Z]+/g, ' ');
  const originalTextArray = originalText.split(' ').filter(w => w);
  const matchedRedundantPhrases = [];
  
  for (let index = 0; index < originalTextArray.length; index++) {
    // Get the word and the first letter of word
    const word = originalTextArray[index];
    const wordFirstLetter = word[0].toLowerCase();

     // Get the correct dictionary with O(1) access
    const redundantPhrasesDictionary = redundantDictionary[wordFirstLetter];
    matchedRedundantPhrases.push(matchPhrases(redundantPhrasesDictionary, word, originalTextArray));
  }
  // Remove undefined/empty/null matchedPhrases
  const matchedRedundantPhrasesFiltered = matchedRedundantPhrases.filter(w => w);
  replaceAtOriginalText(matchedRedundantPhrasesFiltered);
}

function matchPhrases(redundantPhrasesArray, word, originalTextArray) {
  for (let index = 0; index < redundantPhrasesArray.length; index++) {
    const redundantPhrase = redundantPhrasesArray[index];

    // If the word appears as a substring of a redundant phrase
    if(redundantPhrase.includes(word.toLowerCase())) {
      const redundantPhraseLength = redundantPhrase.split(' ').length;
      const redundantPhraseComplete = redundantPhrase.replace(/[()]/g,"").toLowerCase();
      const redundantPhraseClean = redundantPhrase.match(/\((.*)\)/).pop();

      const phraseToCompare = createPhraseToCompare(redundantPhraseLength, word, originalTextArray);

      // Compare that both phrases are equal
      if(phraseToCompare.toLowerCase() === redundantPhraseComplete) {
        const phraseToCompareHighlighted = "<span class='highlight'>"+redundantPhraseClean+'</span>'
        return { phraseToCompareHighlighted, redundantPhraseClean }
      }
    }
  }
}

function replaceAtOriginalText(matchedPhrases) {
  let originalText = document.getElementById('original-text').value;
  
  for (let index = 0; index < matchedPhrases.length; index++) {
    const phraseToReplace = matchedPhrases[index];
    const phraseRegex = new RegExp(phraseToReplace.redundantPhraseClean,'i');
    originalText = originalText.replace(phraseRegex, phraseToReplace.phraseToCompareHighlighted);
  }
  appendResultText(originalText);
}

function appendResultText(resultText) {
  let resultTextContainer = document.getElementById('result-text');
  resultTextContainer.innerHTML = resultText;
}

// Recursive function. Construct the phrase to compare depending the original-text. Gets called 'n' times depending the redundantPhraseLength.
function createPhraseToCompare(redundantPhraseLength, word, originalTextArray) {
  const index = originalTextArray.indexOf(word);

  if(redundantPhraseLength === 1) {
    return word;
  }

  return word + ' ' + createPhraseToCompare(redundantPhraseLength - 1, originalTextArray[index+1], originalTextArray)
}