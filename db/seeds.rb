# encoding: utf-8

q1 = Question.create!(difficulty: 1, sentence: "Hello")
Translation.create!(question_id: q1.id, sentence: "你好", language: "hanzi")
Translation.create!(question_id: q1.id, sentence: "nǐ hǎo", language: "pinyin")

q2 = Question.create!(difficulty: 1, sentence: "How are you?")
Translation.create!(question_id: q2.id, sentence: "你好吗？", language: "hanzi")
Translation.create!(question_id: q2.id, sentence: "nǐ hǎo ma?", language: "pinyin")
