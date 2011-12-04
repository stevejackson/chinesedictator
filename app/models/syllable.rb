class Syllable < ActiveRecord::Base
  belongs_to :question
  
  def full
    initial + final
  end
end
