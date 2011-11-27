function Dictator() {
  this.dictations = new Array("");
  this.completed = false;
}


Dictator.prototype.sanitize = function(input, keepSpaces) {
  if(input == undefined) {
    input = ' ';
  }
  var sanitized = "";
  if(keepSpaces) {
    var sanitized = input.replace(/[\?|\!|\,|\.|！|？|，|。|：]/gi, '');
  }
  else {
    var sanitized = input.replace(/[\?|\!|\,|\.| |！|？|，|。|：]/gi, '');
  }
  return sanitized.toLowerCase();
}

Dictator.prototype.sanitizationsUpToIndex = function(input, index) {
  var before = input.substring(0, index);
  var sanitized = this.sanitize(before, false);
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

// Takes the complete target, and the partial sanitized version.
// Returns the unsanitized version up to the partial sanitized version.
Dictator.prototype.matchPartialSanitizedToTarget = function(target, partialSanitized) {
  var i = 0;
  for(i = target.length; i > 0; i--) {
    var partialTarget = target.substring(0, i);
    var targetSanitized = this.sanitize(partialTarget, false);

    if(targetSanitized == partialSanitized) {
      return partialTarget;
    }
  }

  return "";
}

Dictator.prototype.getHint = function(target, input) {
  var sanitizedTarget = this.sanitize(target, true);
  var sanitizedInput = this.sanitize(input, true);
  
  // discover where we start to differ from the input.
  var i = 0;
  var beginningOfWord = 0;
  for(i = 0; i <= sanitizedInput.length; i++) {
    if(sanitizedTarget.charAt(i) == ' ') {
      beginningOfWord = i + 1;
    }
    var partialTarget = sanitizedTarget.substring(0, i);
    var partialInput = sanitizedTarget.substring(0, i);
    if(partialTarget != partialInput)
      break;
  }

  // now let's grab the hint
  sanitizedTarget = sanitizedTarget.substring(beginningOfWord, sanitizedTarget.length); 
  var endOfWord = sanitizedTarget.indexOf(" ") > 0 ? sanitizedTarget.indexOf(" ") : sanitizedTarget.length;
  var hint = sanitizedTarget.substring(0, endOfWord);

  return hint;
}

Dictator.prototype.analyze = function(input) {
  this.failureIndex = 0;
  this.complete = false;

  // sanitize the input. we don't care about their punctuation.
  sanitizedInput = this.sanitize(input, false);

  // help us track which dictation they're working on.
  var largestFailureIndex = 0;

  for(i in this.dictations) {
    // sanitize the sentence we're comparing it to as well!
    sanitizedSentence = this.sanitize(this.dictations[i], false);

    var comparison = this.compareStringsByChar(sanitizedInput, sanitizedSentence);
    if(comparison[0] == 'true') {
      this.failureIndex = sanitizedSentence.length;
      this.completed = true;
      this.dictationTarget = this.dictations[i];
      this.correctSoFar = this.dictations[i];
      return true;
    }

    var comparisonFailureIndex = comparison[0];
    if(comparisonFailureIndex >= largestFailureIndex) {
      this.failureIndex = comparisonFailureIndex;
      largestFailureIndex = this.failureIndex;
      this.dictationTarget = this.dictations[i];
      this.sanitizedTarget = sanitizedSentence;

      var correctSoFarSanitized = sanitizedInput.substring(0, this.failureIndex);
      this.correctSoFar = this.matchPartialSanitizedToTarget(this.dictationTarget, correctSoFarSanitized);
      this.hint = this.getHint(this.dictationTarget, input);
    }
    else if(largestFailureIndex == 0) {
      this.dictationTarget = this.dictations[0];
      this.hint = this.getHint(this.dictationTarget, input);
    }
  }

};

