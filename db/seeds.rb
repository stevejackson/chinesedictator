# encoding: utf-8

q1 = Question.create!(difficulty: 1, sentence: "hello")
Translation.create!(question_id: q1, sentence: "你好", language: "hanzi")
Translation.create!(question_id: q1, sentence: "nǐ hǎo", language: "pinyin")
