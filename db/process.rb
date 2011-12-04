# encoding: utf-8

require 'nokogiri'
require 'open-uri'
require 'csv' 
require 'chinese_pinyin'

require '../app/classes/syllable_generator'

doc = Nokogiri::HTML(open('http://www.archchinese.com/chinese_pinyin.html'))

syllables = []

doc.css('.pinyintable tr td a').each do |link|
  syllable = link['onclick'].slice(/'.+?'/)

  next if syllable.nil?
  syllable.strip
  next if syllable.empty? or syllable == ' '
  syllable = syllable.gsub "\'", ""

  syllables << syllable
end

syllables = syllables.sort_by { |s| s.length }.reverse

def sanitize_keep_spaces(input)
  input.gsub(/[\?|\!|\,|\.|！|？|，|。|：]/, '')
end

def sanitize_no_spaces(input)
  input.gsub(/[\?|\!|\,|\.|！|？|，|。|：| ]/, '')
end

def count_hanzi(input_hanzi)
  input_hanzi.force_encoding 'utf-8'
  no_spaces = input_hanzi.gsub(/[\?|\!|\,|\.|！|？|，|。|：| ]/, '')
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

  pinyin = pinyin.gsub /īu/, 'iū'
  pinyin = pinyin.gsub /íu/, 'iú'
  pinyin = pinyin.gsub /ǐu/, 'iǔ'
  pinyin = pinyin.gsub /ìu/, 'iù'

  pinyin
end

def remove?(pinyin)
  bad_pinyin = ['ā', 'āyō', 'āyōu', 'āyiōu', 'āiyō', 'āiyā' 'āi', 'ō', 'āyòu', 'āiyà', 'ài', 'àiya', 'āyā', 'hēi']

  pinyin = pinyin.gsub(/[\?|\!|\,|\.|！|？|，|。|：| |"|“]/, '')

  if bad_pinyin.include? pinyin
    return true
  end

  false
end

def string_starts_with_syllable(input, syllables)
  syllables.each do |syllable|
    return syllable if input.start_with? syllable
  end

  return nil
end

def separate_syllables(pinyin, syllables)
  pinyin = sanitize_no_spaces(pinyin)
  pinyin = remove_tones(pinyin)
  puts pinyin
  
  result = ""
  until pinyin.nil? or pinyin.empty?
    syllable = string_starts_with_syllable(pinyin, syllables)
    if syllable.nil?
      return "OH SHIT ENGLISH!!!!!!!!!!!!"
    end
    result += syllable
    result += " "
    pinyin.slice!(0, syllable.length)
  end
  result
end

def remove_tones(pinyin)
  pinyin = pinyin.gsub /[āáǎà]/, 'a'
  pinyin = pinyin.gsub /[ēéěè]/, 'e'
  pinyin = pinyin.gsub /[īíǐì]/, 'i'
  pinyin = pinyin.gsub /[ōóǒò]/, 'o'
  pinyin = pinyin.gsub /[ūúǔù]/, 'u'
end

cnt1 = 0
cnt2 = 0
cnt3 = 0
cnt4 = 0
cnt5 = 0

CSV.foreach('seeds.csv') do |line|
  line.each do |i|
    i.force_encoding 'utf-8'
  end

  hanzis = count_hanzi(line[3])
  difficulty = get_difficulty(hanzis) 

  fixed_pinyin = fix_pinyin_tones line[4]

  next if remove? fixed_pinyin

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

  spaced_pinyin = Pinyin.t(line[3])
  spaced_pinyin = sanitize_keep_spaces(spaced_pinyin)
  spaced_pinyin = separate_syllables(fixed_pinyin, syllables)
  puts spaced_pinyin

  CSV.open('seeds2.csv', 'a') do |csv|
    difficulty = difficulty.to_s.force_encoding 'utf-8'

    csv << [difficulty, line[1], line[2], line[3], fixed_pinyin, spaced_pinyin]
  end
end

p cnt1
p cnt2
p cnt3
p cnt4
p cnt5
