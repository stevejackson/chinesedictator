require 'spec_helper'

describe DictatorController do

  before :each do
    @question = FactoryGirl.create :question_with_translations
    @question2 = FactoryGirl.create :question_with_translations_syllable
  end

  it "should load a question on visiting root" do
    get :index

    assigns[:question].difficulty.should == 1
  end

  it "should get a random difficulty 1 question" do
    get :question, { 'difficulty' => 1 }

    assigns[:question].difficulty.should == 1
  end

  it "should get only the entries with the given initials" do
    10.times {
      get :question, { 'difficulty' => 1, 'initials' => '["n"]' }
      assigns[:question].sentence.should == 'Hello'
    }
  end

  it "should get only the entries with the given final" do
    10.times {
      get :question, { 'difficulty' => 1, 'finals' => '["ai"]' }
      assigns[:question].sentence.should == 'Now'
    }
  end

  it "should get only the entries with the given initial and final filters" do
    10.times {
      get :question, {
        'difficulty' => 1,
        'initials' => '["n", "t", "h"]',
        'finals' => '["ao"]' }

      assigns[:question].sentence.should == 'Hello'
    }

    10.times {
      get :question, {
        'difficulty' => 1,
        'initials' => '["n", "t", "h"]',
        'finals' => '["ao", "ai"]' }

      sentence = assigns[:question].sentence
      one_is_true = (sentence == 'Hello' or sentence == 'Now')
      one_is_true.should == true
    }
  end

end
