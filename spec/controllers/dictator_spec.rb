require 'spec_helper'

describe DictatorController do

  before :each do
    @question = Factory :question
  end
  
  it "should load a question on visiting root" do
    get :index
    
    assigns[:question].difficulty.should == 1
  end

  it "get a random difficulty 1 question" do
    get :question, { 'difficulty' => 1 }

    assigns[:question].difficulty.should == 1
  end

end
