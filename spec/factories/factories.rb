# encoding: utf-8

Factory.define :question1, :class => Question do |q|
  q.sentence "Hello"
  q.difficulty 1
  q.uri "testing/test.mp3"
end

Factory.define :translation1, :class => Translation do |t|
  t.language "Pinyin"
  t.sentence "nǐ hǎo"
  t.association :question, :factory => :question1
end

Factory.define :question_with_translation1, :parent => :question1 do |question|
  question.after_create do |a|
    Factory :translation1, :question => a
  end
end

Factory.define :question2, :class => Question do |q|
  q.sentence "How are you?"
  q.difficulty 1
  q.uri "testing/test2.mp3"
end

Factory.define :translation2, :class => Translation do |t|
  t.language "Pinyin"
  t.sentence "nǐ hǎo ma?"
  t.association :question, :factory => :question2
end

Factory.define :question_with_translation2, :parent => :question2 do |question|
  question.after_create do |a|
    Factory :translation2, :question => a
  end
end
