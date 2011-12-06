class Question < ActiveRecord::Base

  has_many :translations, :dependent => :destroy
  has_many :syllables, :dependent => :destroy

  attr_accessible :sentence, :difficulty, :uri

  scope :by_difficulty, lambda { |diff| 
    where(:difficulty => diff)
    .order("RANDOM()")
  }

  scope :filter_initials, lambda { |diff, initials|
    joins(:syllables)
    .where(:syllables => { :initial => initials })
    .where(:difficulty => diff)
    .order("RANDOM()")
  }

  scope :filter_finals, lambda { |diff, finals|
    joins(:syllables)
    .where(:syllables => { :final => finals })
    .where(:difficulty => diff)
    .order("RANDOM()")
  }

  scope :filter_initials_and_finals, lambda { |diff, initials, finals|
    joins(:syllables)
    .where('syllables.initial IN (:initials) OR syllables.final IN (:finals)',
          { :initials => initials, :finals => finals })
    .where(:difficulty => diff)
    .order("RANDOM()")
  }

end
