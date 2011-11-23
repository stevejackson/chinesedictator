class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :set_locale

  def set_locale
    I18n.locale = params[:locale]
  end
  
  def url_options
    { :locale => I18n.locale }.merge(super)
  end
end
