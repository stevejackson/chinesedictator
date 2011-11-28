# encoding: utf-8

require 'csv'

def count_hanzi(input_hanzi)
  input_hanzi.force_encoding 'utf-8'
  no_spaces = input_hanzi.gsub(/[\?|\!|\,|\.|！|？|，|。|：| ]/, '');
  no_spaces.length
end

def get_difficulty(num_characters)
  if num_characters <= 2
    1
  elsif num_characters <= 4
    2
  elsif num_characters <= 6
    3
  elsif num_characters <= 8
    4
  else
    5
  end
end

def fix_pinyin_tones(pinyin)
  pinyin = pinyin.gsub /ūi/, 'uī'
  pinyin = pinyin.gsub /úi/, 'uí'
  pinyin = pinyin.gsub /ǔi/, 'uǐ'
  pinyin = pinyin.gsub /ùi/, 'uì'

  pinyin = pinyin.gsub /ūo/, 'uō'
  pinyin = pinyin.gsub /úo/, 'uó'
  pinyin = pinyin.gsub /ǔo/, 'uǒ'
  pinyin = pinyin.gsub /ùo/, 'uò'

  pinyin
end

cnt1 = 0
cnt2 = 0
cnt3 = 0
cnt4 = 0
cnt5 = 0

CSV.foreach('seeds.csv') do |line|
  hanzis = count_hanzi(line[3])
  difficulty = get_difficulty(hanzis) 

  case difficulty
  when 1
    cnt1 = cnt1 + 1
  when 2
    cnt2 = cnt2 + 1
  when 3
    cnt3 = cnt3 + 1
  when 4
    cnt4 = cnt4 + 1
  when 5
    cnt5 = cnt5 + 1
  end

  CSV.open('seeds2.csv', 'a') do |csv|
    difficulty = difficulty.to_s.force_encoding 'utf-8'
    line.each do |i|
      i.force_encoding 'utf-8'
    end

    fixed_pinyin = fix_pinyin_tones line[4]
    csv << [difficulty, line[1], line[2], line[3], fixed_pinyin]
  end
end

p cnt1
p cnt2
p cnt3
p cnt4
p cnt5

