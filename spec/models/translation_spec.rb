require 'spec_helper'

describe Translation do
  
  before :each do
    @translation = FactoryGirl.create(:translation, language: 'spaced_pinyin', sentence: 'ni hao')

    # create a second translation to ensure we're not generating syllables for it
    @translation2 = Factory :translation
  end

  it "should have data" do
    @translation.language.should == 'spaced_pinyin'
    @translation.sentence.should == 'ni hao'
  end

  it "should generate syllables for parent question if it is spaced_pinyin" do
    @translation.question.should_not == nil
    @translation.question.syllables.count.should == 2

    @translation.question.syllables[0].initial.should == 'n'
  end

end
