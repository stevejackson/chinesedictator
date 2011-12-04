class CreateSyllables < ActiveRecord::Migration
  def change
    create_table :syllables do |t|
      t.string :initial
      t.string :final

      t.timestamps
    end
  end
end
