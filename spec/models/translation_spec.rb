require 'spec_helper'

describe Translation do
  
  before :each do
    @question = Factory :question1
    @translation = Factory :translation1
  end

  it "should respond to question" do
    @translation.should respond_to :question
    @translation.question.should_not == nil
  end

end
