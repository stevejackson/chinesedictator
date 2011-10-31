ChineseDictator::Application.routes.draw do
  match 'question' => 'dictator#question'
  root :to => 'dictator#index'
end
