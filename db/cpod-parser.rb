# encoding: utf-8
#
# script to parse a chinese pod vocab page to generate a csv with data from that page
# in a format valid for our seeds.rb file

require 'nokogiri'
require 'open-uri'
require 'ting/string'

puts 'tTESTESTestest'
file = File.open('file.html')
doc = Nokogiri::HTML(file) 

doc.css('div.dialogue-list > div').each_with_index do |dialogue, index|
  # grab the audio link
  audio = dialogue.css('div .css_data').text
  hanzi_sentence = ''
  pinyin_sentence = ''
  english_sentence = ''

  # cut out some bullshit in the front we don't need to grab the sentence
  children = dialogue.children
  3.times { children.shift }

  # now we're somewhere useful. we're at the first span containing a word.
  children.each do |entry|
    # we only want shit up to the <br>
    break if entry.to_s == '<br>'

    if entry.to_s.match(/^<span/)
      # we need to grab the hanzi and append it.
      hanzi_sentence << entry.text
      
      # grabbing the pinyin is involved.
      pinyin = entry['onmouseover']
      pinyin = pinyin.split "'"
      pinyin_sentence << pinyin[3].pretty_tones
    else
      # it's punctuation. tack it on.
      hanzi_sentence << entry.text
      pinyin_sentence << entry.text
    end

    # put some space in the pinyin.
    pinyin_sentence << ' '


    puts "-#{entry.to_s}-"
  end
  
  puts hanzi_sentence
  puts pinyin_sentence
  puts english_sentence
  puts '-------------------------'
end

doc.css('div.dialogue-list > div').each_with_index do |dialogue, index|
end
