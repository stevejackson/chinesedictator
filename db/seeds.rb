# encoding: utf-8

require 'csv'

def seedcsv(filename)
  count = 0
  CSV.foreach(filename) do |row|
    q = Question.create! difficulty: row[0],
                         uri: row[1],
                         sentence: row[2]
    Translation.create! question_id: q.id,
                        language: 'hanzi',
                        sentence: row[3]
    Translation.create! question_id: q.id,
                        language: 'pinyin',
                        sentence: row[4]
    Translation.create! question_id: q.id,
                        language: 'spaced_pinyin',
                        sentence: row[5]

    count += 1
  end

  count
end

count = seedcsv("db/seeds.csv")

puts "Seeding complete. Seeded #{count} rows."
