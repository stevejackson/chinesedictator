# encoding: utf-8

module SyllableGenerator

  InitialSet = [
    'zh', 'ch', 'sh', 'b', 
    'p', 'm', 'f', 'd', 't',
    'n', 'l', 'g', 'k', 'h', 'j',
    'q', 'x', 'r', 'z', 'c', 's',
    'w', 'y', 'a', 'e', 'o'
  ]

  FinalSet = [
    'an','ang','ao','e','ei','en','eng',
    'i','ia','ian','iang','iao','ie',
    'in','ing','iong','iu','n','ng','o',
    'ong','ou','r','u','ua','uai','uan',
    'uang','ue','ui','un','uo','ü','üe'
  ]

  class FullSyllable
    attr_accessor :full, :initial, :final

    def initialize(full)
      @full = full
      process
    end

    def process
      analyzed = @full.partition(/^#{InitialSet.join '|'}/)
      @initial = analyzed[1]
      @final = analyzed[2]
    end

  end

  def self.process_sentence(sentence)
    return "" if not sentence

    processed = []
    sentence.split(' ').each do |word|
      processed << FullSyllable.new(word)
    end

    processed
  end

end
