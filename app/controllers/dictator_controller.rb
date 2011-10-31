class DictatorController < ApplicationController

  def index
  end

  def question
    difficulty = params[:difficulty].to_i
    question = Question.where(:difficulty => difficulty)

    session[:question] = question
  end

end
