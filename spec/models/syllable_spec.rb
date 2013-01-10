require 'spec_helper'

describe Syllable do

  before :each do
    @syllable = FactoryGirl.create :syllable
  end

  it "should have data" do
    @syllable.initial.should == 'n'
    @syllable.final.should == 'i'

    @syllable.full.should == 'ni'
  end

end
