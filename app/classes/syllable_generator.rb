module SyllableGenerator

  InitialSet = [
    'zh', 'ch', 'sh', 'b', 
    'p', 'm', 'f', 'd', 't',
    'n', 'l', 'g', 'k', 'h', 'j',
    'q', 'x', 'r', 'z', 'c', 's'
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
