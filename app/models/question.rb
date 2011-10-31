class Question < ActiveRecord::Base
  has_many :translations, :dependent => :destroy

  scope :translations, where(:all).includes(:translations)

  attr_accessible :sentence, :difficulty
end
