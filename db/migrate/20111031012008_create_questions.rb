class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :sentence
      t.integer :difficulty

      t.timestamps
    end
  end
end
