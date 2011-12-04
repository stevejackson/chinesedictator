# encoding: utf-8

require 'nokogiri'
require 'open-uri'

doc = Nokogiri::HTML(open('http://www.archchinese.com/chinese_pinyin.html'))


syllables = []
doc.css('.pinyintable tr td a').each do |link|
  syllable = link['onclick'].slice(/'.+?'/)

  next if syllable.nil?
  syllable.strip
  next if syllable.empty? or syllable == ' '
  syllable.gsub "'", ""

  syllables << link['onclick'].slice(/'.+?'/)
end

puts syllables
puts syllables.count
