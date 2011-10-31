Factory.define :question do |q|
  q.sentence "Hello"
  q.difficulty 1
end

Factory.define :translation do |t|
  t.language "Pinyin"
  t.sentence "Hello"
  t.association :question
end
