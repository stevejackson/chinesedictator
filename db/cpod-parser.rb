# encoding: utf-8
#
# script to parse a chinesepod dialogue page to generate a csv with data from that page
# process:
# 1. paste source of dialogue page into file.html
# 2. bundle exec ruby cpod-parser.rb
# 3. repeat 1 and 2 as desired
# 4. look through and delete bad data - it's not 100%.
# 5. copy the data to seeds.rb
# 6. ruby process.rb

require 'nokogiri'
require 'open-uri'
require 'ting/string'

def numbers_to_spaced_pinyin(input)
  input = input.gsub(/[\d]/, ' ')
  input = input.squeeze
end

file = File.open('file.html')
doc = Nokogiri::HTML(file) 

doc.css('div.dialogue-list > div').each do |dialogue|
  # grab the audio link
  audio = dialogue.css('div .css_data').text
  hanzi_sentence = ''
  pinyin_sentence = ''
  spaced_pinyin_sentence = ''
  english_sentence = ''

  # cut out some bullshit in the front we don't need to grab the sentence
  children = dialogue.children
  3.times { children.shift }

  # now we're somewhere useful. we're at the first span containing a word.
  before_br = true
  children.each do |entry|
    # we only want things up to the <br>
    if entry.to_s == '<br>'
      before_br = false
    end

    if before_br
      if entry.to_s.match(/^<span/)
        hanzi_sentence << entry.text

        pinyin = entry['onmouseover']
        pinyin = pinyin.split "'"
        pinyin_sentence << pinyin[3].pretty_tones
        spaced_pinyin_sentence << numbers_to_spaced_pinyin(pinyin[3]).downcase
      else
        # it's punctuation.
        hanzi_sentence << entry.text
        pinyin_sentence << entry.text
      end

      # put some space in the pinyin.
      pinyin_sentence << ' '
    else
      if entry.to_s.match /^<span/
        english_sentence << entry.text
        break
      end
    end
  end

  hanzi_sentence = hanzi_sentence.strip
  pinyin_sentence = pinyin_sentence.strip
  english_sentence = english_sentence.strip

  puts hanzi_sentence
  puts pinyin_sentence
  puts spaced_pinyin_sentence
  puts english_sentence
  puts '---'

  CSV.open('scraped.csv', 'a') do |csv|
    csv << [ARGV[0], audio, english_sentence, hanzi_sentence, pinyin_sentence, spaced_pinyin_sentence]
  end

end
