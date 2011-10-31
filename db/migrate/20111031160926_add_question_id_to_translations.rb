class AddQuestionIdToTranslations < ActiveRecord::Migration
  def change
    add_column :translations, :question_id, :integer
  end
end
