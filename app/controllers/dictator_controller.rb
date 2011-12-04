class DictatorController < ApplicationController

  def index
    @question = get_question(1)
  end

  def question
    difficulty = params[:difficulty].to_i
    initials = params[:initials]
    finals = params[:finals]
    @question = get_question(difficulty, initials, finals)

    respond_to do |format|
      format.js
    end
  end

  private

  def get_question(difficulty, initials='', finals='')
    filter_initials = !initials.blank?
    filter_finals = !finals.blank?

    if filter_initials and filter_finals
      question = Question.filter_initials_and_finals(difficulty, initials, finals)
    elsif filter_initials
      question = Question.filter_initials(difficulty, initials)
    elsif filter_finals
      question = Question.filter_finals(difficulty, finals)
    else
      question = Question.by_difficulty(difficulty)
    end

    question.first
  end

end
