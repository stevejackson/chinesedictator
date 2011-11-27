# encoding: utf-8

require 'csv'

cnt1 = 0
cnt2 = 0
cnt3 = 0
cnt4 = 0
cnt5 = 0

CSV.foreach('seeds.csv') do |line|
  difficulty = line[0].to_i

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
  
end

p cnt1
p cnt2
p cnt3
p cnt4
p cnt5

