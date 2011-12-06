require 'syllable_generator'

class Translation < ActiveRecord::Base

  belongs_to :question

  after_create :create_syllables

  accepts_nested_attributes_for :question

  # generate the initials and finals if this is a spaced_pinyin translation
  # being imported
  def create_syllables
    if self.language == 'spaced_pinyin'
      SyllableGenerator.process_sentence(sentence).each do |syllable|
        self.question.syllables.create!(:initial => syllable.initial, :final => syllable.final)
      end
    end
  end

end
