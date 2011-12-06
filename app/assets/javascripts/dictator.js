"use strict";

function Dictator() {
  this.dictations = [""];
  this.completed = false;
}

// remove unwanted punctuation for comparisons
Dictator.prototype.sanitize = function (input, keepSpaces) {
  if (input === undefined) {
    input = '';
  }
  var sanitized = "";
  if (keepSpaces) {
    sanitized = input.replace(/[\?|\!|\,|\.|！|？|，|。|、|：]/gi, '');
    sanitized = sanitized.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
  } else {
    sanitized = input.replace(/[\?|\!|\,|\.| |！|？|，|、|。|：]/gi, '');
  }
  return sanitized.toLowerCase();
};

// only sanitize up to a given index of a string
Dictator.prototype.sanitizationsUpToIndex = function (input, index) {
  var before = input.substring(0, index),
    sanitized = this.sanitize(before, false);
  return before.length - sanitized.length;
};

// find out where the strings are no longer equal
Dictator.prototype.compareStringsByChar = function (string1, string2) {
  var i = 0,
    furthest = 0;

  if (string1.length === 0 && string2.length > 0) {
    return 0;
  }

  for (i = 0; i < string1.length; i += 1) {
    if (string1.charAt(i) !== string2.charAt(i)) {
      return i;
    }
    furthest = i;
  }

  // if they're correct so far, but don't have enough...
  if (string1.length < string2.length) {
    return furthest + 1;
  }

  return true;
};

// Takes the complete target, and the partial sanitized version.
// Returns the unsanitized version up to the partial sanitized version.
Dictator.prototype.matchPartialSanitizedToTarget = function (target, partialSanitized) {
  var i = 0,
    targetSanitized,
    partialTarget;

  for (i = target.length; i > 0; i -= 1) {
    partialTarget = target.substring(0, i);
    targetSanitized = this.sanitize(partialTarget, false);

    if (targetSanitized === partialSanitized) {
      return partialTarget;
    }
  }

  return "";
};

// Determines the first word that is currently uncomplete, and returns it.
Dictator.prototype.getHint = function (target, input) {
  var sanitizedTarget = this.sanitize(target, true),
    sanitizedInput = this.sanitize(input, true),
    i = 0,
    beginningOfWord = 0,
    partialTarget,
    partialInput,
    endOfWord,
    hint;

  // discover where we start to differ from the input.
  for (i = 0; i <= sanitizedInput.length; i += 1) {
    if (sanitizedTarget.charAt(i - 1) === ' ') {
      beginningOfWord = i;
    }

    partialTarget = sanitizedTarget.substring(0, i);
    partialInput = sanitizedInput.substring(0, i);

    if (partialTarget !== partialInput) {
      break;
    }

    // If they have all the words right so far, and there's a space coming up
    // then give them the next word.
    else if (i == sanitizedInput.length && sanitizedTarget.charAt(i) == ' ') {
      beginningOfWord = i + 1;
    }
  }
  
  // now let's grab the hint
  sanitizedTarget = sanitizedTarget.substring(beginningOfWord, sanitizedTarget.length);
  endOfWord = sanitizedTarget.indexOf(" ") > 0 ? sanitizedTarget.indexOf(" ") : sanitizedTarget.length;
  hint = sanitizedTarget.substring(0, endOfWord);

  return hint;
};

Dictator.prototype.analyze = function (input) {
  this.failureIndex = 0;
  this.complete = false;

  // sanitize the input. we don't care about their punctuation.
  var sanitizedInput = this.sanitize(input, false),
    largestFailureIndex = 0, // help us track which dictation they're working on.
    i = 0,
    sanitizedSentence,
    comparison,
    comparisonFailureIndex,
    correctSoFarSanitized;

  for (i = 0; i < this.dictations.length; i += 1) {
    // sanitize the sentence we're comparing it to as well
    sanitizedSentence = this.sanitize(this.dictations[i], false);

    comparison = this.compareStringsByChar(sanitizedInput, sanitizedSentence);
    if (comparison === true) {
      this.failureIndex = sanitizedSentence.length;
      this.completed = true;
      this.dictationTarget = this.dictations[i];
      this.correctSoFar = this.dictations[i];
      return true;
    }

    if (comparison > largestFailureIndex) {
      this.failureIndex = comparison;
      largestFailureIndex = this.failureIndex;
      this.dictationTarget = this.dictations[i];
      this.sanitizedTarget = sanitizedSentence;

      correctSoFarSanitized = sanitizedInput.substring(0, this.failureIndex);
      this.correctSoFar = this.matchPartialSanitizedToTarget(this.dictationTarget, correctSoFarSanitized);
      this.hint = this.getHint(this.dictationTarget, input);
    }
    else if (largestFailureIndex === 0) {
      this.dictationTarget = this.dictations[0];
      this.hint = this.getHint(this.dictationTarget, input);
    }
  }

};
