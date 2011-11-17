# encoding: utf-8
#
# script to parse a chinese pod vocab page to generate a csv with data from that page
# in a format valid for our seeds.rb file

require 'nokogiri'
require 'open-uri'

file = File.open('file.html')
doc = Nokogiri::HTML(file)

doc.css('div.dialogue-list > div').each_with_index do |dialogue, index|
  audio = dialogue.css('div .css_data').text

  spans = dialogue.css('span')
  hanzi = ''
  spans.each do |span|
    if span['onclick'] == 'onWordClick()'
      hanzi << span.text
    end
  end

  puts hanzi

  puts '------'
  puts '$$$$$$$'
end
