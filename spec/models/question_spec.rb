require 'spec_helper'

describe Question do

  before :each do
    @question = Factory :question_with_translations
  end

  it "should have data" do
    @question.should respond_to :difficulty
    @question.should respond_to :sentence
    @question.should respond_to :uri
  end

  it "should get associated translations" do
    q = Question.find(@question)
    q.translations.count.should == 3
  end

  it "should have associated syllables" do
    q = Question.find(@question)
    q.syllables.count.should == 2
  end

end
