# encoding: utf-8

require 'csv'

CSV.foreach("db/seeds.csv") do |row|
  q = Question.create! difficulty: row[0],
                       uri: row[1],
                       sentence: row[2]
  Translation.create! question_id: q.id,
                      language: 'hanzi',
                      sentence: row[3]
  Translation.create! question_id: q.id,
                      language: 'pinyin',
                      sentence: row[4]
end

puts 'Seeding complete.'
