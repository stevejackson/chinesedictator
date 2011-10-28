function Dictator() {
  this.dictations = new Array("");
  this.completed = false;
}

Dictator.prototype.analyze = function(input) {
  this.failureIndex = 0;
  this.complete = false;

  function sanitize(input) {
    var sanitized = input.replace(/[\?|\!|\,|\.| ]/gi, '');
    return sanitized.toLowerCase();
  }

  function sanitizationsUpToIndex(input, index) {
    var before = input.substring(0, index);
    var sanitized = sanitize(before);
    return before.length - sanitized.length;
  }

  function compareStringsByChar(string1, string2) {
    var i = 0;
    for(i = 0; i < string1.length; i++) {
      if(string1.charAt(i) != string2.charAt(i)) {
        return i;
      }
    }
    return true;
  }

  // sanitize the input. we don't care about their punctuation.
  sanitizedInput = sanitize(input);

  for(i in this.dictations) {
    // sanitize the sentence we're comparing it to as well!
    sanitizedSentence = sanitize(this.dictations[i]);

    var comparison = compareStringsByChar(sanitizedInput, sanitizedSentence);
    if(comparison == true) {
      this.completed = true;
      return true;
    }
    else {
      this.failureIndex = comparison + sanitizationsUpToIndex(input, comparison);
    }
  }

};

