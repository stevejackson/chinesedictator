Factory.define :question do |q|
  q.sentence "Hello"
  q.difficulty 1
  q.association :translation
end

Factory.define :translation do |t|
  t.language "Pinyin"
  t.sentence "Hello"
end
