class CreateTranslations < ActiveRecord::Migration
  def change
    create_table :translations do |t|
      t.string :language
      t.string :sentence

      t.timestamps
    end
  end
end
