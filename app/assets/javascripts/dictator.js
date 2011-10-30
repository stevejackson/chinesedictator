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
    var returnArray = new Array(1);

    if(string1.length == 0 && string2.length > 0) {
      returnArray[0] = 'false';
      return returnArray;
    }

    var furthest = 0;
    for(i = 0; i < string1.length; i++) {
      if(string1.charAt(i) != string2.charAt(i)) {
        var failureIndex = new Array(1);
        failureIndex[0] = i + 1;
        return failureIndex;
      }
      furthest = i;
    }

    // if they're correct so far, but don't have enough...
    if(string1.length < string2.length) {
      var failureIndex = new Array(1);
      failureIndex[0] = furthest + 1;
      return failureIndex;
    }

    returnArray[0] = 'true';

    return returnArray;
  }

  // sanitize the input. we don't care about their punctuation.
  sanitizedInput = sanitize(input);

  for(i in this.dictations) {
    // sanitize the sentence we're comparing it to as well!
    sanitizedSentence = sanitize(this.dictations[i]);

    var comparison = compareStringsByChar(sanitizedInput, sanitizedSentence);
    if(comparison[0] == 'true') {
      this.completed = true;
      return true;
    }

    this.failureIndex = comparison[0] + sanitizationsUpToIndex(input, comparison);

  }

};

