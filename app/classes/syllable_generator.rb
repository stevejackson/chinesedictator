# encoding: utf-8

module SyllableGenerator

  InitialSet = [
    'zh', 'ch', 'sh', 'b', 
    'p', 'm', 'f', 'd', 't',
    'n', 'l', 'g', 'k', 'h', 'j',
    'q', 'x', 'r', 'z', 'c', 's'
  ]

  FinalSet = [
    'a', 'o', 'e', 'al', 'el', 'ao',
    'ou', 'an', 'ang', 'en', 'eng', 'er',
    'u', 'ua', 'uo', 'uai', 'ul', 'uan',
    'uang', 'un', 'ueng', 'ong', 'i', 'ia',
    'ie', 'iao', 'iu', 'ian', 'iang', 'in',
    'ing', 'ü', 'üe', 'üan', 'ün', 'iong'
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
