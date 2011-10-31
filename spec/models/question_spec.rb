require 'spec_helper'

describe Question do

  before :each do
    @q1 = Factory :question_with_translation1
    @q2 = Factory :question_with_translation2
  end

  it "should have data" do
    @q1.should respond_to :difficulty
    @q1.should respond_to :sentence
  end

  it "should get associated translations" do
    q = Question.find(@q1)
    q.translations.count.should == 1
  end

end
