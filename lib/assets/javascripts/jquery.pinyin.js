
(function($) {

var TONES = {
	'a': {1:'ā',2:'á',3:'ǎ',4:'à',5:'a'},
	'o': {1:'ō',2:'ó',3:'ǒ',4:'ò',5:'o'},
	'e': {1:'ē',2:'é',3:'ě',4:'è',5:'e'},
	'i': {1:'ī',2:'í',3:'ǐ',4:'ì',5:'i'},
	'u': {1:'ū',2:'ú',3:'ǔ',4:'ù',5:'u'},
	'ü': {1:'ǖ',2:'ǘ',3:'ǚ',4:'ǜ',5:'ü'},
	'A': {1:'Ā',2:'Á',3:'Ǎ',4:'À',5:'A'},
	'O': {1:'Ō',2:'Ó',3:'Ǒ',4:'Ò',5:'O'},
	'E': {1:'Ē',2:'É',3:'Ě',4:'È',5:'E'},
	'I': {1:'Ī',2:'Í',3:'Ǐ',4:'Ì',5:'I'},
	'U': {1:'Ū',2:'Ú',3:'Ǔ',4:'Ù',5:'U'},
	'Ü': {1:'Ǖ',2:'Ǘ',3:'Ǚ',4:'Ǜ',5:'Ü'}
};

function getCaret(el) { 
	if (el.selectionStart) 
		return el.selectionStart; 
	
	if (document.selection) { 
		el.focus(); 
		var r = document.selection.createRange(); 
		if (r == null) 
			return 0; 

		var re = el.createTextRange(), 
		rc = re.duplicate(); 
		re.moveToBookmark(r.getBookmark()); 
		rc.setEndPoint('EndToStart', re); 

		return rc.text.length; 
	}  
	return 0; 
}
function setCaretTo(obj, pos) { 
	 if(obj.createTextRange) { 
		  /* Create a TextRange, set the internal pointer to
			  a specified position and show the cursor at this
			  position
		  */ 
		  var range = obj.createTextRange(); 
		  range.move("character", pos); 
		  range.select(); 
	 } else if(obj.selectionStart) { 
		  /* Gecko is a little bit shorter on that. Simply
			  focus the element and set the selection to a
			  specified position
		  */ 
		  obj.focus(); 
		  obj.setSelectionRange(pos, pos); 
	 } 
}

function is_vowel(char) {
	return 'āáǎàaōóǒòoēéěèeīíǐìiūúǔùuǖǘǚǜüv'.indexOf(char.toLowerCase()) !== -1	
}

function deaccent(t) {
	return t
		.replace(/[āáǎàa]/g,'a')
		.replace(/[ĀÁǍÀA]/g,'A')
		.replace(/[ōóǒòo]/g,'o')
		.replace(/[ŌÓǑÒO]/g,'O')
		.replace(/[ēéěèe]/g,'e')
		.replace(/[ĒÉĚÈE]/g,'E')
		.replace(/[īīíǐìi]/ig,'i')
		.replace(/[ūúǔùu]/ig,'u')
		.replace(/[ǖǘǚǜüv]/ig,'ü');

	return r.toLowerCase();
}

/*
back track and replace.
The rules of pinyin:
- pinyin vowles are consecutive. 
- a and e are trumps, and always get the tone mark.  
	- there is no "ae" or "ea".
- in "ou" the "o" takes the tone mark.
- all other cases the final vowel get the tone mark.
*/
function apply_accents(text, pos, tone) {
	var range = { };
	var found_vowel = false;
	while(pos >= 1) {
		var c = text.substr(pos-1,1)
		if(!found_vowel && is_vowel(c)) {
			range.end = pos;
			found_vowel = true;
		}
		if(!found_vowel && c.match(/\s/) ) {
			return;
		}
		if( (found_vowel && !is_vowel(c))) {
			range.start = pos;
			break;
		}
		if( found_vowel && pos === 1 && is_vowel(c) ){
			range.start = 0;
			break;
		}
		pos--;
	}
	
	var vowels = deaccent(text.substr(range.start, range.end - range.start))
	if(!vowels.length)
		return;
	
	if(vowels.toLowerCase().indexOf('a') !== -1) {
		vowels = vowels.replace('a',TONES['a'][tone]).replace('A',TONES['A'][tone]);
	} else if (vowels.toLowerCase().indexOf('e') !== -1) {
		vowels = vowels.replace('e',TONES['e'][tone]).replace('E',TONES['E'][tone]);
	} else if (vowels.toLowerCase() == 'ou') {
		vowels = vowels.replace('o',TONES['o'][tone]).replace('O',TONES['O'][tone]);
	} else {
		var last = vowels.substr(-1);
		if(last) {
			vowels = vowels.replace(last,TONES[last][tone]);
		}
	}
	return text.substr(0,range.start) + vowels + text.substr(range.end);
}
function keyhandler(e) {
	var key = e.which ? e.which : e.keyCode;
	
	// convert v to ü
	if(key == 118) {
		var p = getCaret(this);
		var chars = $(this).val().split('');
		chars.splice(p,0,'ü');
		$(this).val( chars.join('') );
		return false;
	}
	var tone = key - 48;
	if(tone < 1 || tone > 5)
		return true;
	
	var caret_pos = getCaret(this);
	var res = apply_accents($(this).val(),caret_pos,tone)
	if(res !== undefined) {
		$(this).val(res);
		setCaretTo(this,caret_pos);
		return false;
	} else {
		return true;
	}

}
$.format_pinyin = function(text,tone) {
	return apply_accents(text,text.length,tone);
}
$.extend($.fn,{
	enable_pinyin_input: function() {
		return $(this).each(function() {
			$(this).keypress(keyhandler);
		});
	},
	disable_pinyin_input: function() {
		return $(this).each(function() {
			$(this).unbind('keypress',keyhandler);
		});
	}
})


})(jQuery);
