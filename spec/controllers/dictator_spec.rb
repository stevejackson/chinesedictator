require 'spec_helper'

describe DictatorController do
  
  it "get a random difficulty 1 question" do
    get :question, { 'difficulty' => 1 }

    session['question'].should_not be_nil

    session['question'].difficulty.should_be 1
  end

end
