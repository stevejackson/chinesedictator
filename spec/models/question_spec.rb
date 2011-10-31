require 'spec_helper'

describe Question do

  before :each do
    @q1 = Factory :question
    @translation = Factory :translation
  end

  it "should have a translation" do
    @q1.should respond_to :translations
  end

  it "should have data" do
    @q1.should respond_to :difficulty
    @q1.should respond_to :sentence
  end

end
