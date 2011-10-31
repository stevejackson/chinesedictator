class DictatorController < ApplicationController

  def index
    get_question(1)
  end

  def question
    difficulty = params[:difficulty].to_i
    get_question(difficulty)

    respond_to do |format|
      format.js
    end
  end

  private

  def get_question(difficulty)
    @question = Question.where(:difficulty => difficulty).order("RANDOM()").first
  end
end
