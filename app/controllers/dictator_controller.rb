class DictatorController < ApplicationController

  def index
  end

  def question
    difficulty = params[:difficulty].to_i

    question = Question.first(:order => "RANDOM()")

    session[:question] = question
  end

end
