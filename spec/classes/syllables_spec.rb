require 'spec_helper'
require 'syllable_generator'

describe SyllableGenerator do

  before :each do
    @sui = SyllableGenerator::FullSyllable.new('sui')
    @shui = SyllableGenerator::FullSyllable.new('shui')
  end

  it "should have data" do
    @sui.should respond_to :full
    @sui.should respond_to :initial
    @sui.should respond_to :final
  end

  it "should generate the correct initials" do
    @sui.initial.should == 's'
    @shui.initial.should == 'sh'
  end

  it "should generate the correct finals" do
    @sui.final.should == 'ui'
    @shui.final.should == 'ui'
  end

  # generate something for every initial.
  # bogus/fake finals - we're not worried about them.
  it "should work comprehensively" do
    SyllableGenerator::InitialSet.each do |initial|
      fake_final = 'iao'

      syllable = SyllableGenerator::FullSyllable.new(initial + fake_final)

      syllable.initial.should == initial
      syllable.final.should == fake_final
      syllable.full.should == initial + fake_final
    end
  end

  it "should process sentences" do
   processed = SyllableGenerator.process_sentence('ni hao')
   processed[0].initial.should == 'n'
   processed[0].final.should == 'i'
   processed[1].initial.should == 'h'
   processed[1].final.should == 'ao'
  end

end
