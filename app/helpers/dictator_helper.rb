require 'syllable_generator'

module DictatorHelper
  include SyllableGenerator

  def render_syllable_list(prefix)
    set = prefix == 'final' ? FinalSet : InitialSet;

    str = ""
    str += "<div class=\"#{prefix}set\">"
    set.each_with_index do |content, index|
      if index % 5 == 0
        str += "</div>"
        str += "<div class=\"#{prefix}set\">"
      end

      str += check_box_tag "#{prefix}_#{content}", 'no', false, id: "#{prefix}_#{content}"
      str += "<label for=\"#{prefix}_#{content}\">#{content}</label>"
        
    end

    str += "</div>"
    raw(str)
  end
end
