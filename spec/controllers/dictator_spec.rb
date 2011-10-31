require 'spec_helper'

describe DictatorController do

  before :each do
    @question = Factory :question
  end
  
  it "get a random difficulty 1 question" do
    get :question, { 'difficulty' => 1 }

    session[:question].difficulty.should == 1
  end

end
