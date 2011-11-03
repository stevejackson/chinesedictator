class AddUriToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :uri, :string
  end
end
