class Question < ActiveRecord::Base
  has_many :translations, :dependent => :destroy

  attr_accessible :sentence, :difficulty, :uri
end
