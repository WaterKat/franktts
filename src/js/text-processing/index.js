const WordFilter = require('./word-filter.js');
const CharFilter = require('./char-filter.js');
const EmoteFilter = require('./emote-filter.js');

class TTSFilter{
    constructor(_badWords, _emoteTypeWhitelist = []){
        this.badWordFilter = new WordFilter(_badWords, false, 'ᴺᴺᴺᴺ');
        this.badCharFilter = new CharFilter();
        this.badEmoteFilter = new EmoteFilter(_emoteTypeWhitelist);
    }

    filterBadWords(_text){
        return this.badWordFilter.filter(_text);
    }

    filterBadChars(_text){
        return this.badCharFilter.filter(_text);
    }

    filterBadEmotes(_text, _emotes = []){
        return this.badEmoteFilter.filter(_text, _emotes);
    }

    filterAll(_text, _emotes = [], _blacklist = []){
        if (!_text)
            return '';

        let response = _text;

        response = this.filterBadChars(response);
        response = this.filterBadEmotes(response, _emotes);
        response = this.filterBadWords(response);

        if (_blacklist.length > 0){
            response = new WordFilter(_blacklist, true, '').filter(response);
        }

        return response;
    }
}

module.exports = TTSFilter;
