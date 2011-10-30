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

  it("should set index of comparison failure", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewio, hey there!");

    expect(dictator.failureIndex).toBe(6);
  });

  it("should set index of comparison failure insensitive to sanitization", function() {
    dictator.dictations = new Array("Stewie, hey there!");
    dictator.analyze("Stewie, heiy there!");

    expect(dictator.failureIndex).toBe(11);
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
    dictator.dictations =  new Array("你好吗？");
    dictator.analyze("你好吗？");

    expect(dictator.completed).toBeTruthy();
  });

});
