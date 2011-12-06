# encoding: utf-8

require 'nokogiri'
require 'open-uri'

require '../app/classes/syllable_generator'

doc = Nokogiri::HTML(open('http://www.archchinese.com/chinese_pinyin.html'))

syllables = []
doc.css('.pinyintable tr td a').each do |link|
  syllable = link['onclick'].slice(/'.+?'/)

  next if syllable.nil?
  syllable.strip
  next if syllable.empty? or syllable == ' '
  syllable = syllable.gsub "\'", ""

  syllables << "'" + syllable + "'"
end

File.open('syllables.txt', 'w') do |f|

  f.print '['
  f.print "'" + syllables.join(',') + "'"
  f.print ']'

  f.puts ''
  f.puts ''

  f.print '['

  result = syllables.map do |s| 
    fs = SyllableGenerator::FullSyllable.new(s)
    "'" + fs.final.gsub('v', 'ü') + "'"
  end
  result.uniq!

  puts result
  puts result.count
  result = result.sort

  f.print '[' + result.join(',') + ']'

end

