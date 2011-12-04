class AddQuestionIdToSyllables < ActiveRecord::Migration
  def change
    add_column :syllables, :question_id, :integer
  end
end
