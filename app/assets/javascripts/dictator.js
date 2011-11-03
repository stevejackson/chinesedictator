function Dictator() {
  this.dictations = new Array("");
  this.completed = false;
}


Dictator.prototype.sanitize = function(input) {
  if(input == undefined) {
    input = ' ';
  }
  var sanitized = input.replace(/[\?|\!|\,|\.| |！|？|，|。]/gi, '');
  return sanitized.toLowerCase();
}

Dictator.prototype.sanitizationsUpToIndex = function(input, index) {
  var before = input.substring(0, index);
  var sanitized = this.sanitize(before);
  return before.length - sanitized.length;
}

Dictator.prototype.compareStringsByChar = function(string1, string2) {
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
      failureIndex[0] = i;
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

Dictator.prototype.analyze = function(input) {
  this.failureIndex = 0;
  this.complete = false;

  // sanitize the input. we don't care about their punctuation.
  sanitizedInput = this.sanitize(input);

  // help us track which dictation they're working on.
  var largestFailureIndex = 0;

  for(i in this.dictations) {
    // sanitize the sentence we're comparing it to as well!
    sanitizedSentence = this.sanitize(this.dictations[i]);

    var comparison = this.compareStringsByChar(sanitizedInput, sanitizedSentence);
    if(comparison[0] == 'true') {
      this.failureIndex = sanitizedSentence.length;
      this.completed = true;
      this.dictationTarget = this.dictations[i];
      return true;
    }

    var comparisonFailureIndex = comparison[0] + this.sanitizationsUpToIndex(input, comparison[0]);
    if(comparisonFailureIndex >= largestFailureIndex) {
      this.failureIndex = comparisonFailureIndex;
      largestFailureIndex = this.failureIndex;
      this.dictationTarget = this.dictations[i];
    }
    else {
      this.dictationTarget = this.dictations[0];
    }
  }

};

