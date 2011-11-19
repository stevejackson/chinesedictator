describe("Dictator", function() {

  var dictator;
  var inputDictation1;
  var inputDictation2;
  var userInput;

  beforeEach(function() {
    dictator = new Dictator();
  });

  it("should compare an input to a dictation", function() {
    dictator.dictations = new Array("stewie doc", "peter pan");
    dictator.analyze("stewie doc");

    expect(dictator.completed).toBeTruthy();
  });

  it("should compare an input ignoring extraneous punctuation [?.!, ]", function() {
    dictator.dictations = new Array("stewie doc");
    dictator.analyze("stew? ie, d?!.oc");

    expect(dictator.completed).toBeTruthy();
  });

  it("should compare an input ignoring extraneous chinese punctuation [？！，。]", function() {
    dictator.dictations = new Array("stewie doc");
    dictator.analyze("stew？！。  ie, d，oc");

    expect(dictator.completed).toBeTruthy();
  });

  it("should ignore case", function() {
    dictator.dictations = new Array("Stewie DoC");
    dictator.analyze("stewiE doc");
    expect(dictator.completed).toBeTruthy();
  });

  it("should be incomplete when inaccurate", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewio, hey there!");

    expect(dictator.completed).toBeFalsy();
  });

  it("should be incomplete when not yet finished", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewie");

    expect(dictator.completed).toBeFalsy();
  });

  // Conditional of testing if it's complete, 1 resolves to same as "true"
  it("should be incomplete even at failure index of 1", function() {
    dictator.dictations = new Array("Stewie, hey there");
    dictator.analyze("S");

    expect(dictator.completed).toBeFalsy();
  });

  it("should set index of failure properly", function() {
    dictator.dictations = new Array("nǐ hǎo ma?", "你好吗？");

    dictator.analyze(" ");
    expect(dictator.failureIndex).toBe(0);
    dictator.analyze("你");
    expect(dictator.failureIndex).toBe(1);
    dictator.analyze("你好");
    expect(dictator.failureIndex).toBe(2);
    dictator.analyze("你好吗");
    expect(dictator.failureIndex).toBe(3);

    dictator.dictations = new Array("Stewie, hey there!");

    dictator.analyze("Stewio, hey there!");
    expect(dictator.failureIndex).toBe(5);
  });

  it("should set index of comparison failure sensitive to sanitization", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewie, heiy there!");

    expect(dictator.failureIndex).toBe(8);
  });

  it("should show completion as false when testing an empty string", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("");

    expect(dictator.completed).toBeFalsy();
  });

  it("should be able to test input string of longer length", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewie, hey there! I'm Steve.");

    expect(dictator.completed).toBeFalsy();
  });

  it("should be able to compare hanzi", function() {
    dictator.dictations = new Array("你好吗？");
    dictator.analyze("你好吗？");

    expect(dictator.completed).toBeTruthy();
  });

  it("should detect which dictation target you're working on", function() {
    dictator.dictations = new Array("zǎo, lǎoshīhǎo", "早，老师好", "useless");

    dictator.analyze("早");
    expect(dictator.dictationTarget).toBe("早，老师好");

    dictator.analyze("z");
    expect(dictator.dictationTarget).toBe("zǎo, lǎoshīhǎo");

    dictator.dictationTarget = undefined;
    dictator.analyze("");
    expect(dictator.dictationTarget).toBe("zǎo, lǎoshīhǎo");
  });

  it("should detect correctSoFar", function() {
    dictator.dictations = new Array("早，老师好", "zǎo, lǎo shī hǎo");

    dictator.analyze("zǎo, lao");
    expect(dictator.correctSoFar).toBe("zǎo, l");

    dictator.analyze("zǎolǎo sheee");
    expect(dictator.correctSoFar).toBe("zǎo, lǎo sh");

    dictator.analyze("z");
    expect(dictator.correctSoFar).toBe("z");

    dictator.dictations = new Array("wǒ jiào wáng píng. nǐ ne?");
    dictator.analyze("wǒ jiào wáng p");
    //alert(dictator.failureIndex);
    //alert(dictator.sanitizations);
    expect(dictator.correctSoFar).toBe("wǒ jiào wáng p");
  });

});
