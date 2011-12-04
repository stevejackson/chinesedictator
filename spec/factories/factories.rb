# encoding: utf-8

FactoryGirl.define do

  factory :question do |q|
    q.sentence "Hello"
    q.difficulty 1
    q.uri "testing/test.mp3"
  end

  factory :question_with_translations, :parent => :question do |question|
    question.after_create { |q| 
      Factory :translation, :question => q
      Factory :translation, :question => q, :sentence => "你好", :language => 'Hanzi'
      Factory :translation, :question => q, :sentence => "ni hao", :language => 'spaced_pinyin'
    }
  end

  factory :question_with_translations_syllable, :parent => :question do |question|
    question.sentence 'Now'
    question.after_create { |q| 
      Factory :translation, :question => q, :sentence => "xian zai", :language => 'spaced_pinyin'
    }
  end

  factory :translation do |t|
    t.language 'Pinyin'
    t.sentence 'nǐ hǎo'

    question
  end

  factory :syllable do |s|
    s.initial 'n'
    s.final 'i'
  end

end
