# encoding: utf-8
#
# this script processes seeds.csv into seeds2.csv and does the following:
# - assigns a difficulty value based on number of hanzi
# - filters out entries which we don't want (primarily on onomatapoeia)
# - fixes some misplaced tonal markers from the chinesepod dataset
# - squeezes (removes extra spaces) pinyin and spaced_pinyin columns
# - strips (removes spaces at the beginning/end) of pinyin and spaced_pinyin
# columns

require 'nokogiri'
require 'open-uri'
require 'csv' 
require 'chinese_pinyin'

doc = Nokogiri::HTML(open('http://www.archchinese.com/chinese_pinyin.html'))

def sanitize_keep_spaces(input)
  input.gsub(/[\?|\!|\,|\.|！|？|，|、|。|：]/, '')
end

def sanitize_no_spaces(input)
  input.gsub(/[\?|\!|\,|\.|！|？|，|。|、|：| ]/, '')
end

def count_hanzi(input)
  sanitize_no_spaces(input).length
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
  bad_pinyin = ['a', 'ayo', 'ayou', 'ayiou', 'aiyou', 'aiya', 'ai', 'o', 'ayou', 'aiya', 'hei']

  pinyin = sanitize_no_spaces(pinyin)
  pinyin = remove_tones(pinyin)

  bad_pinyin.include? pinyin
end

def remove_tones(pinyin)
  pinyin = pinyin.gsub /[āáǎà]/, 'a'
  pinyin = pinyin.gsub /[ēéěè]/, 'e'
  pinyin = pinyin.gsub /[īíǐì]/, 'i'
  pinyin = pinyin.gsub /[ōóǒò]/, 'o'
  pinyin = pinyin.gsub /[ūúǔù]/, 'u'
  pinyin = pinyin.gsub /[ǖǘǚǜ]/, 'ü'
end

difficulty_count = [0,0,0,0,0]

lines = []

# import the data from the csv into an array of lines
CSV.foreach('seeds.csv') do |line|
  line.each { |l| l.force_encoding 'utf-8' }

  # find out if this is a unique line
  valid = true
  lines.each do |existing|
    # not unique
    valid = false if sanitize_keep_spaces(existing[3]) == sanitize_keep_spaces(line[3])
  end

  # should we filter this line out?
  line[4] = fix_pinyin_tones line[4]
  valid = false if remove? line[4]

  lines << line if valid
end

lines.each do |line|
  hanzis = count_hanzi(line[3])
  difficulty = get_difficulty(hanzis) 

  difficulty_count[difficulty-1] += 1 

  CSV.open('seeds2.csv', 'a') do |csv|
    difficulty = difficulty.to_s.force_encoding 'utf-8'

    line[4] = line[4].strip.squeeze
    line[5] = line[5].strip.squeeze

    csv << [difficulty, line[1], line[2], line[3], line[4], line[5]]
  end
end

difficulty_count.each { |x| puts x }
